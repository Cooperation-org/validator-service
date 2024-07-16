import { Request, Response } from 'express'
import { UserService } from '../services'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  public createClaim = async (req: Request, res: Response) => {
    try {
      const data = req.body
      const result = await this.userService.createClaim(data)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating claim: ' + error.message })
    }
  }

  public createDetailedClaim = async (req: Request, res: Response) => {
    try {
      const data = req.body
      const result = await this.userService.createDetailedClaim(data)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating claim: ' + error.message })
    }
  }

  public sendValidationRequests = async (req: Request, res: Response) => {
    try {
      const data = req.body
      await this.userService.sendValidationRequests(data)
      res.status(200).json({ message: 'Validation requests sent' })
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error sending validation requests: ' + error.message })
    }
  }

  public validateClaim = async (req: Request, res: Response) => {
    try {
      const validationId = req.params.validationId
      const data = req.body
      await this.userService.validateClaim(validationId, data)
      res.status(200).json({ message: 'Validation recorded' })
    } catch (error: any) {
      res.status(500).json({ message: 'Error validating claim: ' + error.message })
    }
  }

  public generateReport = async (req: Request, res: Response) => {
    try {
      const claimId = req.params.claimId
      const report = await this.userService.generateReport(claimId)
      res.status(200).json({ message: 'Report generated', data: report })
    } catch (error: any) {
      res.status(500).json({ message: 'Error generating report: ' + error.message })
    }
  }
}
