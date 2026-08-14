import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users_todo_tables', (table) => {
        table
            .integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .notNullable()
        table
            .integer('todo_table_id')
            .unsigned()
            .references('id')
            .inTable('todo_tables')
            .notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users_todo_tables')
}
