import { sendEmail } from '..//utils/email'
import prisma from '../../prisma/prisma-client'
import Joi from 'joi'

export class ValidationService {
  public async getValidationRequest(validationId: string) {
    const validationRequest = await prisma.validationRequest.findFirst({
      where: { id: +validationId }
    })
    if (!validationRequest) {
      throw new Error('Validation request not found')
    }

    return validationRequest
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

      // Prepare email addresses
      const emailAddresses = validators.map(
        (validator: { name: any; email: any }) => validator.email
      )

      // Send email
      const emailResponse = await sendEmail({
        to: emailAddresses,
        subject: 'New LinkedTrust claim request',
        body: 'Please review the new claim request'
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
}
