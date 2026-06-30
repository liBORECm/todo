import swaggerAutogen from 'swagger-autogen'
import dotenv from 'dotenv'
import path from 'node:path'
import { sync } from 'glob'
dotenv.config()

const doc = {
    info: {
        version: 'v0.0.1',
        title: 'TODO LIST API',
        description: 'TODO LIST... its just a todo list.',
    },
    basePath: '/',
    host: `${process.env.URL || 'localhost'}:${process.env.PORT}`,
    schemes: ['http', 'https'],
}

// AI-generated start
const endpointsFiles = sync(path.join(__dirname, '**/*.controller.ts'))
// AI-generated end
const outputFile = './swagger-output.json'

swaggerAutogen()(outputFile, endpointsFiles, doc)
