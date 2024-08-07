import { ValidationDetailsI } from './../index.d'
import { ResponseStatus, ValidationStatus } from '@prisma/client'
import { ReportI } from '../index.d'

export const generateReportData = (data: any): ReportI => {
  return {
    claimId: data.userInfo.claimId,
    subject: data.claim.claimId,
    object: data.claim.object,
    source: data.claim.sourceURI,
    status: generateStatus(data.validationDetails),
    candid_entity_id: data.userInfo.candid_entity_id,
    reposnse: generateReportResponseColor(
      data.validationDetails.map((detail: any) => detail.response)
    ),
    validationDetails: data.validationDetails.map((detail: ValidationDetailsI) => {
      return {
        validatorName: detail.validatorName,
        validatorEmail: detail.validatorEmail,
        validationStatus: detail.validationStatus,
        rating: detail.rating,
        response: detail.response,
        validationDate: detail.validationDate,
        statement: detail.statement
      }
    })
  }
}

const generateStatus = (validationDetails: any) => {
  const pending = validationDetails.some(
    (detail: any) => detail.validationStatus === ValidationStatus.PENDING
  )
  return pending ? 'PENDING' : 'COMPLETED'
}

export const generateRequestResponseColor = (rating: number) => {
  if (rating >= 4) return 'GREEN'
  else if (rating >= 2) return 'YELLOW'
  else return 'RED'
}

export const generateReportResponseColor = (responses: (string | null)[]) => {
  let totalScore = 0
  let validResponsesCount = 0

  responses.forEach(response => {
    if (response === null) return

    switch (response) {
      case ResponseStatus.GREEN:
        totalScore += 3
        validResponsesCount += 1
        break
      case ResponseStatus.YELLOW:
        totalScore += 2
        validResponsesCount += 1
        break
      case ResponseStatus.RED:
        totalScore += 0
        validResponsesCount += 1
        break
      default:
        throw new Error('Invalid response status')
    }
  })

  if (validResponsesCount === 0) {
    throw new Error('No valid responses to calculate the score')
  }

  const averageScore = totalScore / validResponsesCount

  if (averageScore >= 2.5) return 'GREEN'
  if (averageScore >= 1.5) return 'YELLOW'
  return 'RED'
}
