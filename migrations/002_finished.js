exports.up = async function(knex) {
  return knex.schema.alterTable("tasks", (table) => {
    table.timestamp("finished_at")
  })
}

exports.down = async function(knex) {
  return knex.schema.alterTable("tasks", (table) => {
    table.dropColumn("finished_at")
  })
}
