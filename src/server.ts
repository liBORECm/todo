import dotenv from 'dotenv'
dotenv.config()
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './server.controller'
import swaggerDocs from './swagger'

const app: Application = express()
const port = Number(process.env.PORT) || 5533

// #region AI-GENERATED
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

function parseDates(value: unknown): unknown {
    if (typeof value === 'string' && ISO_DATE_RE.test(value))
        return new Date(value)
    if (Array.isArray(value)) return value.map(parseDates)
    if (value !== null && typeof value === 'object')
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, parseDates(v)]),
        )
    return value
}
// #endregion

app.use(express.json())
// #region AI-GENERATED
app.use((req: Request, _res, next) => {
    if (req.body) req.body = parseDates(req.body)
    next()
})
// #endregion
app.use(cors())

app.use(router)

// Swagger
swaggerDocs(app)
console.log(`Api docs is running on http://localhost:${port}/api-docs`)

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Express!')
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
