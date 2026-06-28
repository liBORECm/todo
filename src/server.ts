import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app: Application = express()
const port = Number(process.env.PORT) || 5533

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }))

// Middleware to parse JSON bodies
app.use(express.json())

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!')
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
