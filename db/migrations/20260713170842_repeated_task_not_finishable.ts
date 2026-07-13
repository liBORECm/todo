import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('repeated_tasks', (table) => {
        table.dropColumn('finished_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('repeated_tasks', (table) => {
        table.timestamp('finished_at').nullable().defaultTo(null)
    })
}
