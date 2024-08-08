import { Router } from 'express'
import { UserController } from '../controllers'
import path from 'path'
import fs from 'fs'
import prisma from '../../prisma/prisma-client'

const router = Router()

// ADD-STATEMENT PAGE
router.get('/', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../',
    'views',
    'templates',
    'forms',
    'statement.html'
  )
  res.sendFile(filePath, (err: any) => {
    if (err) {
      console.error('Error serving the file:', err)
      res.status(err.status || 500).send('Something went wrong!')
    }
  })
})

// recommend validators
router.get('/recommend', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../',
    'views',
    'templates',
    'forms',
    'validators.html'
  )
  res.sendFile(filePath, (err: any) => {
    if (err) {
      console.error('Error serving the file:', err)
      res.status(err.status || 500).send('Something went wrong!')
    }
  })
})

router.get('/validation/:validationRequestId', async (req, res) => {
  const validationRequestId = req.params.validationRequestId
  const filePath = path.join(__dirname, '../', 'views', 'templates', 'forms', 'get-validation.html')
  const filePathValidated = path.join(__dirname, '../', 'views', 'templates', 'forms', 'validated.html')

  try {
    const user = await prisma.validationRequest.findUnique({
      where: {
        id: +validationRequestId
      }
    })

    if (user?.statement) {
      fs.readFile(filePathValidated, 'utf8', (err: any, validatedData) => {
        if (err) {
          console.error('Error reading the file:', err)
          res.status(err.status || 500).send('Something went wrong!')
          return
        }
        res.send(validatedData)
      })
    } else {
      // Read the HTML file and inject the validationRequestId
      fs.readFile(filePath, 'utf8', (err: any, data) => {
        if (err) {
          console.error('Error reading the file:', err)
          res.status(err.status || 500).send('Something went wrong!')
          return
        }

        // Inject the validationRequestId into a data attribute
        const updatedData = data.replace('{{validationRequestId}}', validationRequestId)
        res.send(updatedData)
      })
    }
  } catch (err) {
    console.error('Error fetching validation request:', err)
    res.status(500).send('Something went wrong!')
  }
})

export default router
