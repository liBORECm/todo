import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('simple_tasks', (table) => {
        table
            .integer('parent_id')
            .unsigned()
            .references('id')
            .inTable('simple_tasks')
            .nullable()
            .defaultTo(null)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('simple_tasks', (table) => {
        table.dropForeign(['parent_id'])
        table.dropColumn('parent_id')
    })
}
