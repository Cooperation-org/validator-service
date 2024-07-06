import express, { Request, NextFunction, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
const path = require('path');

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(express.static(path.join(__dirname, 'views')));

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../views', 'statement-form.html'));
});

app.post('/create-claim', async (req, res) => {
  // const { email, firstName, lastName, profileUrl } = req.body

  // const subject = `https://live.linkedtrust.us/org/candid/applicant/${firstName}-${lastName}`

  // Check if claim already exists
  // Create new claim if not exists
  const statement = req.body.statement
  console.log(statement)
  // Store user info

  res.status(201).json({ message: 'Claim created' })
})

app.post('/send-validation', async (req, res) => {
  const { validators, claimId } = req.body

  // Check if claim exists
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
