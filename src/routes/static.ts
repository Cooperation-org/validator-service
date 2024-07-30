import { Router } from 'express'
import { UserController } from '../controllers'
import path from 'path'

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

export default router
