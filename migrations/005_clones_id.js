exports.up = async function(knex) {
  return knex.schema.alterTable("tasks_prefab", (table) => {
    table.increments("clone_id")
  })
}

exports.down = async function(knex) {
  return knex.schema.alterTable("tasks_prefab", (table) => {
    table.dropColumn("clone_id")
  })
}
