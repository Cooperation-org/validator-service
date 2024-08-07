import { sendEmail } from '..//utils/email'
import prisma from '../../prisma/prisma-client'
import Joi, { link } from 'joi'
import path from 'path'
import handlebars from 'handlebars'
import fs from 'fs'
import { LINKED_TRUST_SERVER_URL, SERVER_URL } from '..//config/settings'
import { generateRequestResponseColor } from '../utils/generateResponse'
import { HowKnown } from '@prisma/client'

export class ValidationService {
  public async getValidationRequest(validationId: string) {
    const validationRequest = await prisma.validationRequest.findUnique({
      where: { id: +validationId }
    })
    if (!validationRequest) {
      throw new Error('Validation request not found')
    }

    return validationRequest
  }

  public async sendValidationRequests(data: any) {
    const { validators, claimId } = data

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
      let emailResponse,
        validationRequestRes = []

      if (validators) {
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

        validationRequestRes = await Promise.all(validationRequests)
      }
      console.log('Validation requests sent successfully', validationRequestRes)

      validationRequestRes.map(
        async (validator: { id: number; validatorName: any; validatorEmail: any }) => {
          const html = template({
            userInfo,
            name: validator.validatorName,
            link: `${SERVER_URL}/validation/${validator.id}`
          })
          // Send email
          emailResponse = await sendEmail({
            to: validator.validatorEmail,
            subject: 'Validation Request - LinkedTrust',
            body: html
          })
        }
      )

      return {
        emailResponse,
        validationRequestRes
      }
    } catch (err: any) {
      console.error('Error sending validation requests:', err.message)
      throw new Error('Error sending validation requests')
    }
  }

  public async validateClaim(validationId: string, data: any) {
    const { statement, rating } = data

    // Schema validation
    const schema = Joi.object({
      statement: Joi.string().required(),
      rating: Joi.number().required()
    })

    const { error } = schema.validate(data)
    if (error) {
      throw new Error('Validation error: ' + error.message)
    }

    const validationRequest = await prisma.validationRequest.findUnique({
      where: { id: +validationId }
    })

    if (!validationRequest) {
      throw new Error('Validation request not found')
    }

    const claim = await prisma.claim.findUnique({
      where: { id: validationRequest.claimId }
    })

    if (!claim) {
      throw new Error('Claim not found')
    }

    const updatedValidatioReq = await prisma.validationRequest.update({
      where: { id: +validationId },
      data: {
        statement,
        rating,
        validationStatus: 'COMPLETED',
        response: generateRequestResponseColor(rating),
        validationDate: new Date()
      }
    })

    const userInfo = (await prisma.candidUserInfo.findUnique({
      where: { claimId: claim.id }
    })) as any

    const subject = `{${LINKED_TRUST_SERVER_URL}/org/candid/applicant/${userInfo.firstName}-${userInfo.lastName}-${userInfo.id}`
    const sourceURI = `${LINKED_TRUST_SERVER_URL}/org/candid/validator/${validationRequest.validatorName}-${validationRequest.validatorEmail}-${validationRequest.id}`
    const reqData = {
      statement,
      stars: rating,
      object: userInfo.profileURL,
      subject,
      howKnown: HowKnown.FIRST_HAND,
      sourceURI,
      issuerId: 'https://live.linkedtrust.us/',
      claim: 'VALIDATOR',
      effectiveDate: new Date()
    }

    const validatorClaim = await prisma.claim.create({
      data: reqData
    })

    if (!validatorClaim) {
      throw new Error('Error creating claim')
    }

    return updatedValidatioReq
  }
}
