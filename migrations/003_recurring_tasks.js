export async function up(knex) {
  await knex.schema.createTable("tasks_prefab", (table) => {
    table.increments("id").primary()
    table.string("name").notNullable()
    table.string("user").notNullable()
    table.text("description")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("deleted_at").nullable().defaultTo(null)
    table.enum("priority", ["0", "1", "2"]).notNullable().defaultTo("1")
    table.string("cron").notNullable()
  })

  await knex.schema.createTable("tasks_clone", (table) => {
    table
    .integer("prefab_id")
    .unsigned()
    .notNullable()
    .references("id")
    .inTable("tasks_prefab")
    table.timestamp("scheduled_at").notNullable().defaultTo(knex.fn.now())
    table.timestamp("finished_at").defaultTo(null)
    table.unique(["prefab_id", "scheduled_at"])
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("tasks_clone")
  await knex.schema.dropTableIfExists("tasks_prefab")
}
