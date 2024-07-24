import { ClaimI } from './../index.d'
import prisma from '../../prisma/prisma-client'
import { sendEmail } from '../utils/email'
import { LINKED_TRUST_LOCAL_URL, LINKED_TRUST_SERVER_URL } from '../config/settings'

export class UserService {
  public async createClaim(data: ClaimI) {
    const { email, firstName, lastName, profileURL } = data

    const emailResult = await sendEmail({
      to: [email],
      subject: 'Welcome to LinkedTrust',
      body: 'Please click the link to claim your account'
    })

    const userInfo = await prisma.candidUserInfo.create({
      data: {
        email,
        firstName,
        lastName,
        profileURL
      }
    })

    return {
      message: 'Claim created',
      data: {
        userInfo,
        emailResponse: emailResult
      }
    }
  }

  public async addClaimStatement(statement: string, id: number) {
    if (typeof id !== 'number') {
      throw new Error('Invalid ID')
    }
    const userInfo = await prisma.candidUserInfo.findFirst({
      where: { id }
    })
    console.log('🚀 ~ UserService ~ addClaimStatement ~ userInfo:', userInfo)
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
      issuerId: 'https://live.linkedtrust.us/'
    }

    const claimResponse = await fetch(LINKED_TRUST_LOCAL_URL + '/api/claim', {
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
    try {
      const IsClaimExist = await prisma.claim.findUnique({
        where: { id: +claimId }
      })
      if (!IsClaimExist) {
        throw new Error('Claim not found')
      }

      const emailAddresses = validators.map(
        (validator: { name: any; email: any }) => validator.email
      )
      const res = await sendEmail({
        to: emailAddresses,
        subject: 'New LinkedTrust claim request',
        body: 'Please review the new claim request'
      })

      await validators.forEach(async (validator: { name: string; email: string }) => {
        await prisma.validationRequest.create({
          data: {
            claimId: +claimId,
            validatorName: validator.name,
            validatorEmail: validator.email,
            context: 'CANDID'
          }
        })
      })
      return res
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
