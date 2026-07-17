import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('repeated_tasks', (table) => {
        table.integer('duration').unsigned()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('repeated_tasks', (table) => {
        table.dropColumn('duration')
    })
}
