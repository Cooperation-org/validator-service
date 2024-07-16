import prisma from '../../prisma/prisma-client'
import { sendEmail } from '../utils/email'
import { LINKED_TRUST_LOCAL_URL, LINKED_TRUST_SERVER_URL } from '../config/settings'

export class UserService {
  public async createClaim(data: any) {
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

  public async createDetailedClaim(data: any) {
    const { statement, id: userInfoId } = data

    const userInfo = await prisma.candidUserInfo.findUnique({
      where: { id: userInfoId }
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
    // Logic to send validation requests
  }

  public async validateClaim(validationId: string, data: any) {
    // Logic to validate claim
  }

  public async generateReport(claimId: string) {
    // Logic to generate report
  }
}
