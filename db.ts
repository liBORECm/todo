import Knex from "knex"
import dotenv from "dotenv"

dotenv.config()

export const db = Knex({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB,
    port: Number(process.env.DB_PORT),
    charset: 'utf8mb4'
  },
})
