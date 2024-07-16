import express, { Request, NextFunction, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import prisma from '../prisma/prisma-client'
import { sendEmail } from './utilities/email'
import { CandidUserInfo } from '@prisma/client'
import { LINKED_TRUST_LOCAL_URL, LINKED_TRUST_SERVER_URL, PORT } from './config/settings'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

/**
 * Description: Create a new claim
 */
app.post('/', async (req, res) => {
  const { email, firstName, lastName, profileURL }: CandidUserInfo = req.body

  // send email to user
  const result = await sendEmail({
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

  res.status(201).json({
    message: 'Claim created',
    data: {
      userInfo,
      emailResponse: result
    }
  })
})

app.post('/create-claim', async (req, res) => {
  try {
    const { statement, id: userInfoId } = req.body
    console.log('🚀 ~ app.post ~ userInfoId:', userInfoId)

    const userInfo = await prisma.candidUserInfo.findUnique({
      where: {
        id: userInfoId
      }
    })
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' })
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
    console.log('🚀 ~ app.post ~ payload:', payload)

    // create
    const claim = await fetch(LINKED_TRUST_LOCAL_URL + '/api/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!claim.ok) {
      return res.status(500).json({ message: 'Error creating claiiiiiiiiiiiiiiiim' })
    }

    res.status(201).json({
      message: 'Claim created',
      data: {
        claim: await claim.json(),
        userInfo
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating claim: ' + error })
  }
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

app.listen(PORT, () => {
  console.log('Server running at http://localhost:3000')
})
