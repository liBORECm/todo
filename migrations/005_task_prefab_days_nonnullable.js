exports.up = async function(knex) {
  return knex.schema.alterTable("tasks_clone", (table) => {
    table.integer("days").notNullable().defaultTo(1).alter()
  })
}

exports.down = async function(knex) {
  return knex.schema.alterTable("tasks_clone", (table) => {
    table.integer("days").nullable().defaultTo(null).alter()
  })
}