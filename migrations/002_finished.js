export async function up(knex) {
  return knex.schema.alterTable("tasks", (table) => {
    table.timestamp("finished_at")
  })
}

export async function down(knex) {
  return knex.schema.alterTable("tasks", (table) => {
    table.dropColumn("finished_at")
  })
}
