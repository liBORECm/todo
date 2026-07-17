import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('todo_tables', (table) => {
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })

    await knex.schema.alterTable('simple_tasks', (table) => {
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })

    await knex.schema.alterTable('repeated_tasks', (table) => {
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })

    await knex.schema.alterTable('repeated_task_instances', (table) => {
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('todo_tables', (table) => {
        table.dropColumn('updated_at')
    })

    await knex.schema.alterTable('simple_tasks', (table) => {
        table.dropColumn('updated_at')
    })

    await knex.schema.alterTable('repeated_tasks', (table) => {
        table.dropColumn('updated_at')
    })

    await knex.schema.alterTable('repeated_task_instances', (table) => {
        table.dropColumn('updated_at')
    })
}
