import { ValidationService } from './../services/Validation'
import { ClaimI } from './../index.d'
import { Request, Response } from 'express'
import { ClaimService } from '../services/Claim'
import path from 'path'
import handlebars from 'handlebars'
import fs from 'fs'
import { sendEmail } from '../utils/email'

export class UserController {
  private ClaimService: ClaimService
  private validationService: ValidationService

  constructor() {
    this.ClaimService = new ClaimService()
    this.validationService = new ValidationService()
  }

  public createUserInfo = async (req: Request, res: Response) => {
    try {
      const data: ClaimI = req.body
      const userInfo = await this.ClaimService.createUserInfo(data)
      // Read and compile the Handlebars template
      const htmlContent = await fs.promises.readFile(
        path.join(__dirname, '../', 'views', 'templates', 'welcome-email.html'),
        'utf8'
      )
      const template = handlebars.compile(htmlContent)

      // Generate the HTML with the template and data
      const html = template({
        firstName: userInfo.firstName || 'User',
        id: userInfo.id
      })
      console.log('html', html)

      res
        .status(201)
        .json({ status: 'success', message: 'Data Received', data: { id: userInfo.id } })

      // Send the email
      await sendEmail({
        to: [userInfo.email],
        subject: 'Welcome to LinkedTrust',
        body: html
      })
    } catch (error: any) {
      if (error.message.includes('Validation')) {
        return res.status(400).json({ status: 'error', message: error.message })
      }
      res
        .status(500)
        .json({ status: 'error', message: 'Error creating claim: ' + error.message })
    }
  }

  public getUserInfo = async (req: Request, res: Response) => {
    try {
      const { claimId } = req.params
      const result = await this.ClaimService.getUserInfo(+claimId)
      res.status(200).json(result)
    } catch (error: any) {
      res.status(500).json({ message: 'Error getting claim: ' + error.message })
    }
  }

  public addClaimStatement = async (req: Request, res: Response) => {
    try {
      const { id, statement } = req.body
      console.log('id from addClaimStatement', id)
      console.log('statement from addClaimStatement', statement)
      const result = await this.ClaimService.addClaimStatement(statement, +id)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating claim: ' + error.message })
    }
  }

  public sendValidationRequests = async (req: Request, res: Response) => {
    try {
      const data = req.body
      await this.validationService.sendValidationRequests(data)
      res.status(200).json({ message: 'Validation requests sent' })
    } catch (error: any) {
      if (error.message.includes('Validation')) {
        return res.status(400).json({ status: 'error', message: error.message })
      }
      res.status(500).json({
        status: 'error',
        message: 'Error sending validation requests: ' + error.message
      })
    }
  }

  public validateClaim = async (req: Request, res: Response) => {
    try {
      const validationId = req.params.validationId
      const data = req.body
      await this.validationService.validateClaim(validationId, data)
      res.status(200).json({ message: 'Validation recorded' })
    } catch (error: any) {
      res.status(500).json({ message: 'Error validating claim: ' + error.message })
    }
  }

  public generateReport = async (req: Request, res: Response) => {
    try {
      const claimId = req.params.claimId
      const report = await this.ClaimService.generateReport(claimId)
      res.status(200).json({ message: 'Report generated', data: report })
    } catch (error: any) {
      res.status(500).json({ message: 'Error generating report: ' + error.message })
    }
  }

  public getValidationRequest = async (req: Request, res: Response) => {
    try {
      const validationId = req.params.validationId
      const validationRequest = await this.validationService.getValidationRequest(
        validationId
      )
      res.status(200).json(validationRequest)
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error getting validation request: ' + error.message })
    }
  }
}
