import prisma from '../../prisma/prisma-client'
import { sendEmail } from '../utils/email'
import { LINKED_TRUST_URL, LINKED_TRUST_SERVER_URL } from '../config/settings'
import Joi from 'joi'
import path from 'path'
import handlebars from 'handlebars'
import fs from 'fs'
import { ClaimI } from '../index.d'

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
      name:
        userInfo.firstName && userInfo.lastName
          ? `${userInfo.firstName} ${userInfo.lastName}`
          : 'Candid User',
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

    // update userInfo
    const updatedUser = await prisma.candidUserInfo.update({
      where: { id },
      data: {
        claimId: claim.claim.id
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
  public async generateReport(claimId: string) {
    // Logic to generate report
  }
}
