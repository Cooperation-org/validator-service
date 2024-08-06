import { ClaimI } from './../index.d'
import prisma from '../../prisma/prisma-client'
import { sendEmail } from '../utils/email'
import { LINKED_TRUST_URL, LINKED_TRUST_SERVER_URL } from '../config/settings'
import Joi from 'joi'
import path from 'path'
import handlebars from 'handlebars'
import fs from 'fs'

export class UserService {
  /**
   * Create a new claim and return the new user info data
   * @param data - User info data
   * @returns User info
   */
  public async createUserInfo(data: ClaimI) {
    const { email, firstName, lastName, profileURL, candid_entity_id } = data

    // validation
    const schema = Joi.object({
      email: Joi.string().email().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      profileURL: Joi.string().required(),
      candid_entity_id: Joi.string().required()
    })
    const { error } = schema.validate(data)
    if (error) {
      throw new Error('Validation error: ' + error.message)
    }

    // Save the user info to the database
    const userInfo = await prisma.candidUserInfo.create({
      data: {
        email,
        firstName,
        lastName,
        profileURL,
        candid_entity_id
      }
    })
    if (!userInfo) {
      throw new Error('Error creating user info')
    }

    return userInfo
  }

  /**
   * Get user info by claim ID
   * @param claimId - Claim ID
   * @returns User info
   */
  public async getUserInfo(claimId: number) {
    if (typeof claimId !== 'number') {
      throw new Error('Invalid ID')
    }

    const userInfo = await prisma.candidUserInfo.findUnique({
      where: { claimId: claimId }
    })

    if (!userInfo) {
      throw new Error('User not found')
    }

    return userInfo
  }

  public async addClaimStatement(statement: string, id: number) {
    if (typeof id !== 'number') {
      throw new Error('Invalid ID')
    }
    const userInfo = await prisma.candidUserInfo.findFirst({
      where: { id }
    })

    if (!userInfo) {
      throw new Error('User not found')
    }

    const subject = `${LINKED_TRUST_SERVER_URL}/org/candid/applicant/${userInfo.firstName}-${userInfo.lastName}-${userInfo.id}`

    const payload = {
      statement,
      object: userInfo.profileURL,
      subject,
      sourceURI: subject,
      howKnown: 'SECOND_HAND',
      claim: 'ADMIN',
      issuerId: 'https://live.linkedtrust.us/',
      name: userInfo.firstName && userInfo.lastName? `${userInfo.firstName} ${userInfo.lastName}` : 'Candid User',
      effectiveDate: new Date()
    }

    const claimResponse = await fetch(LINKED_TRUST_URL + '/api/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!claimResponse.ok) {
      throw new Error('Error creating claim')
    }

    const claim = await claimResponse.json()

    // console.log('claim', claim)

    // update userInfo
    const updatedUser = await prisma.candidUserInfo.update({
      where: { id },
      data: {
        claimId: claim.claim.id
      }
    })

    // console.log('updatedUser', updatedUser)
    return {
      message: 'Claim created',
      data: {
        claim,
        userInfo
      }
    }
  }

  public async sendValidationRequests(data: any) {
    const { validators, claimId } = data
    console.log('validators', validators)
    console.log('claimId', claimId)

    // Schema validation
    const schema = Joi.object({
      validators: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required()
        })
      ),
      claimId: Joi.required()
    })

    const { error } = schema.validate(data)
    if (error) {
      throw new Error('Validation error: ' + error.message)
    }

    try {
      // Check if the claim exists
      const isClaimExist = await prisma.claim.findUnique({
        where: { id: +claimId }
      })

      if (!isClaimExist) {
        throw new Error('Claim not found')
      }

      const userInfo = await prisma.candidUserInfo.findUnique({
        where: { claimId: +claimId }
      })

      console.log('userInfo === ', userInfo)

      // Prepare email addresses
      const emailAddresses = validators.map(
        (validator: { name: any; email: any }) => validator.email
      )

      const htmlContent = await fs.promises.readFile(
        path.join(
          __dirname,
          '../',
          'views',
          'templates',
          'validators-request-email.html'
        ),
        'utf8'
      )
      const template = handlebars.compile(htmlContent)

      // Generate the HTML with the template and data
      let emailResponse

      validators.map(async (validator: { name: any; email: any }) => {
        const html = template({
          userInfo,
          name: validator.name,
        })
        // Send email
        emailResponse = await sendEmail({
          to: validator.email,
          subject: 'Validation Request - LinkedTrust',
          body: html
        })
        console.log('emailResponse', emailResponse)
      })

      // Create validation requests in parallel
      const validationRequests = validators.map(
        async (validator: { name: string; email: string }) => {
          try {
            return await prisma.validationRequest.create({
              data: {
                claimId: +claimId,
                validatorName: validator.name,
                validatorEmail: validator.email,
                context: 'CANDID'
              }
            })
          } catch (error: any) {
            console.error('Error creating validation request:', error.message)
          }
        }
      )

      await Promise.all(validationRequests)

      return emailResponse
    } catch (err: any) {
      console.error('Error sending validation requests:', err.message)
      throw new Error('Error sending validation requests')
    }
  }

  public async validateClaim(validationId: string, data: any) {
    // Logic to validate claim
  }

  public async generateReport(claimId: string) {
    // Logic to generate report
  }
}
