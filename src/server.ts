import dotenv from 'dotenv'
dotenv.config()
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './server.controller'

const app: Application = express()
const port = Number(process.env.PORT) || 5533

app.use(express.json())
app.use(cors())

app.use(router)

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Express!')
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
