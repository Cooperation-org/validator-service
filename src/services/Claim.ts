import prisma from '../../prisma/prisma-client'
import { sendEmail } from '../utils/email'
import { LINKED_TRUST_URL, LINKED_TRUST_SERVER_URL } from '../config/settings'
import Joi from 'joi'
import handlebars from 'handlebars'
import fs from 'fs'
import { ClaimI } from '../index.d'
import { generateReportData } from '../utils/generateResponse'
import { HowKnown } from '@prisma/client'

export class ClaimService {
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

  /**
   * Get claim by claim ID
   * @param claimId - Claim ID
   * @returns Claim
   */

  public async getClaim(claimId: number) {
    if (typeof claimId !== 'number') {
      throw new Error('Invalid ID')
    }

    const claim = await prisma.claim.findUnique({
      where: { id: claimId }
    })

    if (!claim) {
      throw new Error('Claim not found')
    }

    return claim
  }

  public async addClaimStatement(statement: string, id: number | string) {
    const userId = Number(id)
    if (isNaN(userId)) throw new Error('Invalid user ID')

    const userInfo = await prisma.candidUserInfo.findUnique({
      where: { id: userId }
    })
    if (!userInfo) throw new Error('User not found')
    if (userInfo.claimId) {
      throw new Error('Claim already exists')
    }

    const subject = `${LINKED_TRUST_SERVER_URL}/org/candid/applicant/${userInfo.firstName}-${userInfo.lastName}-${userInfo.id}`
    const payload = {
      statement,
      object: userInfo.profileURL,
      subject,
      sourceURI: subject,
      howKnown: HowKnown.SECOND_HAND,
      claim: 'ADMIN',
      issuerId: 'https://live.linkedtrust.us/',
      // name:
      //   userInfo.firstName && userInfo.lastName
      //     ? `${userInfo.firstName} ${userInfo.lastName}`
      //     : 'Candid User',
      effectiveDate: new Date()
    }

    const claim = await prisma.claim.create({
      data: payload
    })
    if (!claim) {
      throw new Error('Error creating claim')
    }

    await prisma.candidUserInfo.update({
      where: { id: +id },
      data: {
        claimId: claim.id
      }
    })

    return {
      message: 'Claim created',
      data: {
        claim,
        userInfo
      }
    }
  }

  public async generateReport(id: string | number) {
    const idNum = Number(id)
    if (isNaN(idNum)) throw new Error('Invalid claim ID')

    const userInfo1 = await prisma.candidUserInfo.findUnique({
      where: { id: idNum }
    })
    if (!userInfo1) throw new Error('User not found')

    const claimId = Number(userInfo1.claimId)

    const userInfo = await this.getUserInfo(+claimId)
    if (!userInfo) throw new Error('User not found')

    const claimData = await prisma.claim.findFirst({
      where: { id: Number(userInfo.claimId) }
    })
    if (!claimData) throw new Error('Claim not found')

    const validationDetails = await prisma.validationRequest.findMany({
      where: { claimId: Number(userInfo.claimId) }
    })
    if (!validationDetails) throw new Error('Validation details not found')

    const data = Object.assign({ userInfo }, claimData, { validationDetails })
    const report = generateReportData(data)
    return report
  }
}
