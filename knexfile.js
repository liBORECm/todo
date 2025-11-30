import "dotenv/config"

export default {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB,
      port: process.env.DB_PORT || 3306,
      charset: "utf8mb4",
      multipleStatements: true,
    },
    migrations: {
      directory: "./migrations",
    },
  },
}
