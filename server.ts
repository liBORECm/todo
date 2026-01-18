import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { db } from "./db"
import { isValidCron } from "cron-validator"

dotenv.config({ quiet: true })
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const users = ["Libor", "Leona", "Společný"]

app.get("/", async (req, res) => {
  res.render("tableSelect.ejs", { tables: users })
})

/**
 * Renders dashboard
 */
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
  } else tasksQuery.whereNull("finished_at").orWhere("finished_at", "")

  const tasks = await tasksQuery
  res.render("taskTable.ejs", { tasks, hideFinished, sort, order, user })
})

/**
 * Renders form for new standard task
 */
app.get("/:user/newForm", async (req, res) => {
  const user = req.params.user

  res.render("newTaskForm.ejs", { user: user })
})

/**
 * Is redirected from new standard task form, creates task and redirects
 * back to standard dashboard
 */
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

/**
 * Is redirected from dashboard, updated task and redirects
 * back to dashboard
 */
app.get("/:user/:id/done", async (req, res) => {
  await db("tasks")
    .select("*")
    .where("id", req.params.id)
    .update("finished_at", db.fn.now())

  res.redirect(`/${req.params.user}`)
})

/**
 * Shows table of prefabtasks
 */
app.get("/:user/prefabTable", async (req, res) => {
  const taskPrefabs = await db("tasks_prefab").where("user", req.params.user).whereNull("deleted_at")
  const user = req.params.user

  res.render("prefabTaskTable.ejs", { taskPrefabs, user })
})

/**
 * Renders form for new standard task
 */
app.get("/:user/newPrefabForm", async (req, res) => {
  const user = req.params.user
  const invalid_cron = req.query.invalid_cron

  res.render("newPrefabTaskForm.ejs", { user, invalid_cron })
})

/**
 * Is redirected from new prefab task form, creates task and redirects
 * back to prefab dashboard
 */
app.post("/:user/newPrefab", async (req, res) => {
  const user = req.params.user
  if (!users.includes(user))
    return res.status(500).json({ error: "unknown user" })

  const name = req.body.name
  const description = req.body.description
  const cronDayOfMonth = req.body.cron_day_of_month
  const cronMonth = req.body.cron_month
  const cronDayOfWeek = req.body.cron_day_of_week
  const priority = req.body.priority

  if (!isValidCron(`0 0 ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`)) {
    res.redirect(
      `/${user}/newPrefabForm?invalid_cron=${cronDayOfMonth}_${cronMonth}_${cronDayOfWeek}`
    )
  }

  await db("tasks_prefab").insert({
    name,
    user,
    description,
    priority,
    cron: `0 0 ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`
  })

  res.redirect(`/${user}/prefabTable`)
})

/**
 * Is redirected from prefab tasks dashboard, deletes prefab task and redirects
 * back to dashboard
 */
app.post("/:user/:id/prefabRemoved", async (req, res) => {
  /* await db("tasks")
    .select("*")
    .where("id", req.params.id)
    .update("finished_at", db.fn.now())

  res.redirect(`/${req.params.user}`) */
})

app.listen(Number(process.env.PORT!), "0.0.0.0", () =>
  console.log(`Budget BE alive on ${process.env.API_URL}:${process.env.PORT}`)
)
