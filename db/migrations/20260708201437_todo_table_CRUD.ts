import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('todo_tables', (table) => {
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        table.timestamp('deleted_at').nullable().defaultTo(null)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('todo_tables', (table) => {
        table.dropColumn('created_at')
        table.dropColumn('deleted_at')
    })
}
