import express, { Request, NextFunction, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import prisma from '../prisma/prisma-client'
import { sendEmail } from './utilities/email'
import { UserInfo } from '@prisma/client'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

/**
 * Description: Create a new claim
 */
app.post('/', async (req, res) => {
  const { email, firstName, lastName, profileURL }: UserInfo = req.body

  // send email to user
  const result = await sendEmail({
    to: [email],
    subject: 'Welcome to LinkedTrust',
    body: 'Please click the link to claim your account'
  })

  const userInfo = await prisma.userInfo.create({
    data: {
      email,
      firstName,
      lastName,
      profileURL
    }
  })

  // const subject = `https://live.linkedtrust.us/org/candid/applicant/${firstName}-${lastName}-${userInfo.id}`

  res.status(201).json({
    message: 'Claim created',
    data: {
      userInfo,
      emailResponse: result
    }
  })
})

app.post('/create-claim', async (req, res) => {
  const { statement } = req.body

  // Check if claim exists
  // Create new claim

  res.status(201).json({ message: 'Claim created' })
})

app.post('/send-validation', async (req, res) => {
  const { validators, claimId } = req.body

  // Check if claim exists from linkedtrust
  // create validation request for each validator
  // send email to each validator

  res.status(200).json({ message: 'Validation requests sent' })
})

app.post('/validate/:validationId', async (req, res) => {
  const { validationId } = req.params
  const { validationStatus, response, validationDate, statement } = req.body

  // Check if validation exists
  // Update validation status

  res.status(200).json({ message: 'Validation recorded' })
})

app.get('/report/:claimId', async (req, res) => {
  const { claimId } = req.params

  // Check if claim exists
  // Get report

  res.status(200).json({ message: 'Report generated' })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).send('Something went wrong!')
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
