// app.ts
import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import userRoutes from './routes'
import { PORT } from './config/settings'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api/users', userRoutes)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).send('Something went wrong!')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
