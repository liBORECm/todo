import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { db } from "./db"
import { isValidCron } from "cron-validator"
import { CronExpressionParser } from "cron-parser"
import cron from "node-cron"
import { logService } from "./logService"
import { pragueStartOfToday } from "./common"

dotenv.config({ quiet: true })
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
//test comment
const users = ["Libor", "Leona", "Společný"]

app.get("/", async (req, res) => {
  res.render("tableSelect.ejs", { tables: users })
})

/**
 * Renders dashboard
 */
app.get("/:user", async (req, res) => {
  const user = req.params.user
  if (!users.includes(user)) return

  const sort =
    req.query.sort === "priority"
      ? "priority"
      : req.query.sort === "deadline"
        ? "deadline"
        : "id"
  const order = req.query.order === "desc" ? "desc" : "asc"
  const hideFinished = req.query.hide_finished

  const todayLocalDate = pragueStartOfToday()

  let tasksQuery = db("tasks").where("user", user)
  let clonesQuery

  if (sort === "priority") {
    tasksQuery
      .orderBy("priority", order)
      .orderByRaw("deadline IS NULL ASC")
      .orderBy("deadline", order)
      .orderBy("id", order)

    clonesQuery = db("tasks_clone")
      .join("tasks_prefab", "tasks_clone.prefab_id", "tasks_prefab.id")
      .where("user", user)
      .whereRaw(
        `
    ? BETWEEN
      DATE(tasks_clone.scheduled_at)
      AND DATE_ADD(
        DATE(tasks_clone.scheduled_at),
        INTERVAL tasks_prefab.days DAY
      )
  `,
        [todayLocalDate],
      )
      .orderBy("priority", order)
      .orderBy("id", order)
  } else if (sort === "deadline") {
    tasksQuery
      .orderByRaw("deadline IS NULL ASC")
      .orderBy("deadline", order)

      .orderBy("priority", order)
      .orderBy("id", order)

    clonesQuery = db("tasks_clone")
      .join("tasks_prefab", "tasks_clone.prefab_id", "tasks_prefab.id")
      .where("user", user)
      .whereRaw(
        `
    ? BETWEEN
      DATE(tasks_clone.scheduled_at)
      AND DATE_ADD(
        DATE(tasks_clone.scheduled_at),
        INTERVAL tasks_prefab.days DAY
      )
  `,
        [todayLocalDate],
      )
      .orderBy("priority", order)
      .orderBy("id", order)
  } else {
    tasksQuery.orderBy("id", order)
    clonesQuery = db("tasks_clone")
      .join("tasks_prefab", "tasks_clone.prefab_id", "tasks_prefab.id")
      .where("user", user)
      .whereRaw(
        `
    ? BETWEEN
      DATE(tasks_clone.scheduled_at)
      AND DATE_ADD(
        DATE(tasks_clone.scheduled_at),
        INTERVAL tasks_prefab.days DAY
      )
  `,
        [todayLocalDate],
      )
      .orderBy("id", order)
  }

  if (hideFinished === "false") {
  } else {
    tasksQuery.whereNull("finished_at")
    clonesQuery.whereNull("finished_at")
  }

  const tasks = await tasksQuery
  const clones = await clonesQuery
  for (const clone of clones) {
    const now = new Date()
    clone.deadline = now
    clone.deadline.setDate(clone.scheduled_at.getDate() + clone.days || 1)
  }

  logService(
    `GETTING STANDARD TASK FOR USER ${user}, HIDING FINISHED: ${hideFinished}`,
    `${tasks.length}`,
    `${tasksQuery}, ${tasks}`,
  )
  logService(
    `GETTING CLONED TASK FOR USER ${user}, HIDING FINISHED: ${hideFinished}`,
    `${clones.length}`,
    `${clonesQuery}, ${clones}`,
  )

  res.render("taskTable.ejs", {
    tasks,
    hideFinished,
    sort,
    order,
    user,
    clones,
  })
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

  logService(
    `INSERTING NEW STANDARD TASK FOR USER ${user}`,
    `${{
      name,
      user,
      description,
      deadline,
      priority,
    }}`,
    `${{
      name,
      user,
      description,
      deadline,
      priority,
    }}`,
  )

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

  logService(`FINISHING STANDARD TASK WITH ID ${req.params.id}`, ``, ``)

  res.redirect(`/${req.params.user}`)
})

/**
 * Shows table of prefabtasks
 */
app.get("/:user/prefabTable", async (req, res) => {
  const taskPrefabs = await db("tasks_prefab")
    .where("user", req.params.user)
    .whereNull("deleted_at")
  const user = req.params.user

  logService(
    `GETTING ALL PREFABS FOR USER ${user}`,
    `${taskPrefabs.length}`,
    `${db("tasks_prefab").where("user", req.params.user).whereNull("deleted_at")}, ${taskPrefabs}`,
  )

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
  const days = req.body.days

  if (!isValidCron(`0 0 ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`)) {
    res.redirect(
      `/${user}/newPrefabForm?invalid_cron=${cronDayOfMonth}_${cronMonth}_${cronDayOfWeek}`,
    )
  }

  logService(
    `INSERTING NEW PREFAB FOR USER ${user}`,
    `${{
      name,
      user,
      description,
      priority,
      cron: `0 0 ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`,
    }}`,
    `${{
      name,
      user,
      description,
      priority,
      cron: `0 0 ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`,
    }}`,
  )

  await db("tasks_prefab").insert({
    name,
    user,
    description,
    priority,
    cron: `0 0 ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`,
    days,
  })

  res.redirect(`/${user}/prefabTable`)
})

/**
 * Is redirected from prefab tasks dashboard, deletes prefab task and redirects
 * back to dashboard
 */
app.get("/:user/:id/prefabRemoved", async (req, res) => {
  await db("tasks_prefab")
    .where("id", req.params.id)
    .update("deleted_at", db.fn.now())

  logService(`DELETING PREFAB WITH ID ${req.params.id}`, ``, ``)

  res.redirect(`/${req.params.user}/prefabTable`)
})

/**
 * Is redirected from task dashboard, updates task clone and redirects back
 */
app.get("/:user/:id/cloneDone", async (req, res) => {
  const id = req.params.id
  await db("tasks_clone")
    .where("clone_id", id)
    .update("finished_at", db.fn.now())

  logService(`FINISHING CLONE WITH ID ${id}`, ``, ``)

  res.redirect(`/${req.params.user}`)
})

async function clonePrefabs() {
  //this function runs at around 00:10 every day
  console.log("running clonePreafbs()! ")
  const startOfToday = pragueStartOfToday()
  const now = new Date()

  const prefabs = await db("tasks_prefab").whereNull("deleted_at")
  const prefabsFiltered = prefabs.filter((prefab) => {
    const cronPrev = CronExpressionParser.parse(prefab.cron, {
      currentDate: now,
      tz: "Europe/Prague",
    })
      .prev()
      .toDate()

    console.log(prefab.name, prefab.cron, cronPrev, startOfToday, now)

    return cronPrev >= startOfToday && cronPrev <= now
  })

  logService(
    `PREFABS TO BE CLONED`,
    `${prefabsFiltered.length}`,
    `${prefabsFiltered}`,
  )

  for (let i = 0; i < prefabsFiltered.length; i++) {
    const prefab = prefabsFiltered[i]
    await db("tasks_clone").insert({
      prefab_id: prefab.id,
      scheduled_at: startOfToday,
    })
  }
}

cron.schedule("10 0 * * *", clonePrefabs, {
  timezone: "Europe/Prague",
})

app.listen(Number(process.env.PORT!), "0.0.0.0", () =>
  logService(
    `TODO APP alive on ${process.env.API_URL}:${process.env.PORT}`,
    ``,
    ``,
  ),
)
