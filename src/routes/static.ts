import { Router } from 'express'
import { UserController } from '../controllers'
import path from 'path'
import fs from 'fs'

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

router.get('/validation/:validationRequestId', (req, res) => {
  const validationRequestId = req.params.validationRequestId
  const filePath = path.join(
    __dirname,
    '../',
    'views',
    'templates',
    'forms',
    'get-validation.html'
  )

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
})

export default router
