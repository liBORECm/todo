import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('repeated_task_instances', (table) => {
        table.dropForeign('repeated_task_id')
        table.dropColumn('repeated_task_id')
        table.string('title').notNullable()
        table.text('description').nullable().defaultTo(null)
        table
            .enum('priority', ['critical', 'standard', 'low'])
            .notNullable()
            .defaultTo('standard')
        table.timestamp('deadline').nullable().defaultTo(null)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('repeated_task_instances', (table) => {
        table
            .integer('repeated_task_id')
            .unsigned()
            .references('id')
            .inTable('repeated_tasks')
        table.dropColumn('title')
        table.dropColumn('description')
        table.dropColumn('priority')
        table.dropColumn('deadline')
    })
}
