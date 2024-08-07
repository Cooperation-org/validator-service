import { ResponseStatus, ValidationStatus } from '@prisma/client'

export interface ClaimI {
  email: string
  firstName: string
  lastName: string
  profileURL: string
  candid_entity_id

  statement?: string
}

export interface ReportI {
  claimId: number
  subject: string
  object: string
  source: string
  status: string
  candid_entity_id: string
  reposnse: string
  validationDetails: ValidationDetailsI[]
}

export interface ValidationDetailsI {
  validatorName: string
  validatorEmail: string
  validationStatus: ValidationStatus
  response: ResponseStatus
  rating: number
  validationDate: string
  statement: string | null
}
