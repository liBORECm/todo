exports.up = async function(knex) {
  return knex.schema.alterTable("tasks_prefab", (table) => {
    table.integer("days")
  })
}

exports.down = async function(knex) {
  return knex.schema.alterTable("tasks_prefab", (table) => {
    table.dropColumn("days")
  })
}
