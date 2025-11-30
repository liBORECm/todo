export async function up(knex) {
  await knex.raw(
    `ALTER DATABASE budget CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  )

  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary()
    table.string("name").notNullable()
    table.string("user").notNullable()
    table.text("description")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.date("deadline")
    table.enu("priority", ["0", "1", "2"]).notNullable().defaultTo("1")
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("tasks")
}
