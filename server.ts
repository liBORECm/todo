import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { db } from "./db"

dotenv.config({ quiet: true })
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const users = ["Libor", "Leona", "Společný"]

app.get("/", async (req, res) => {
  res.render("tableSelect.ejs", { tables: users })
})

app.get("/:user", async (req, res) => {
  const user = req.params.user

  const sort =
    req.query.sort === "priority"
      ? "priority"
      : req.query.sort === "deadline"
      ? "deadline"
      : "id"
  const order = req.query.order === "desc" ? "desc" : "asc"
  const hideFinished = req.query.hide_finished

  let tasksQuery

  if (sort === "priority")
    tasksQuery = db("tasks")
      .select("*")
      .where("user", user)
      .orderBy("priority", order)
      .orderByRaw("deadline IS NULL ASC")
      .orderBy("deadline", order)

      .orderBy("id", order)
  else if (sort === "deadline")
    tasksQuery = db("tasks")
      .select("*")
      .where("user", user)
      .orderByRaw("deadline IS NULL ASC")
      .orderBy("deadline", order)

      .orderBy("priority", order)
      .orderBy("id", order)
  else
    tasksQuery = db("tasks")
      .select("*")
      .where("user", user)
      .orderBy("id", order)

  if (hideFinished === "false") {
  } else tasksQuery.where("finished_at", "")

  const tasks = await tasksQuery
  res.render("taskTable.ejs", { tasks, hideFinished, sort, order, user })
})

app.get("/:user/newForm", async (req, res) => {
  const user = req.params.user

  res.render("newTaskForm.ejs", { user: user })
})

app.post("/:user/new", async (req, res) => {
  const user = req.params.user
  if (!users.includes(user))
    return res.status(500).json({ error: "unknown user" })

  const name = req.body.name
  const description = req.body.description
  const deadline = req.body.deadline === "" ? null : req.body.deadline
  const priority = req.body.priority

  await db("tasks").insert({
    name,
    user,
    description,
    deadline,
    priority,
  })

  res.redirect(`/${user}`)
})

app.get("/:user/:id/done", async (req, res) => {
  await db("tasks")
    .select("*")
    .where("id", req.params.id)
    .update("finished_at", db.fn.now())

  res.redirect(`/${req.params.user}`)
})

app.listen(process.env.PORT, () =>
  console.log(`Budget BE alive on ${process.env.API_URL}:${process.env.PORT}`)
)
