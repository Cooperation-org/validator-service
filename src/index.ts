// app.ts
import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import routes from './routes'
import staticRoutes from './routes/static'
import { PORT } from './config/settings'
import path from 'path'

const app = express()

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')))

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/', staticRoutes)
app.use('/api/v0/', routes)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).send('Something went wrong!')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
