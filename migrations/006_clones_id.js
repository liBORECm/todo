exports.up = async function(knex) {
  // Přidání id do tasks_clone
  await knex.schema.alterTable("tasks_clone", (table) => {
    table.increments("id").primary()
  })
}

exports.down = async function(knex) {
  // Odebrání id
  await knex.schema.alterTable("tasks_clone", (table) => {
    table.dropColumn("id")
  })
}