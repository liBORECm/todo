import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary()
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        table.timestamp('deleted_at').nullable().defaultTo(null)
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
        table.string('name').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users')
}
