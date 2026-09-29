import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('todo_tables', (table) => {
        table.boolean('silent').notNullable().defaultTo(false)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('todo_tables', (table) => {
        table.dropColumn('silent')
    })
}
