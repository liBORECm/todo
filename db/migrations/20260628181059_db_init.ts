import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todo_tables', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
  })

  await knex.schema.createTable('simple_tasks', (table) => {
    table.increments('id').primary()
    table.integer('table_id').unsigned().references('id').inTable('todo_tables')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable().defaultTo(null)
    table.timestamp('finished_at').nullable().defaultTo(null)
    table.timestamp('deadline').nullable().defaultTo(null)
    table.string('title').notNullable()
    table.text('description').nullable().defaultTo(null)
    table
      .enum('priority', ['critical', 'standard', 'low'])
      .notNullable()
      .defaultTo('standard')
  })

  await knex.schema.createTable('repeated_tasks', (table) => {
    table.increments('id').primary()
    table.integer('table_id').unsigned().references('id').inTable('todo_tables')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable().defaultTo(null)
    table.timestamp('finished_at').nullable().defaultTo(null)
    table.string('title').notNullable()
    table.text('description').nullable().defaultTo(null)
    table
      .enum('priority', ['critical', 'standard', 'low'])
      .notNullable()
      .defaultTo('standard')
    table.string('cron').notNullable()
  })

  await knex.schema.createTable('repeated_task_instances', (table) => {
    table.increments('id').primary()
    table.integer('table_id').unsigned().references('id').inTable('todo_tables')
    table
      .integer('repeated_task_id')
      .unsigned()
      .references('id')
      .inTable('repeated_tasks')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('deleted_at').nullable().defaultTo(null)
    table.timestamp('finished_at').nullable().defaultTo(null)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('repeated_task_instances')
  await knex.schema.dropTableIfExists('repeated_tasks')
  await knex.schema.dropTableIfExists('simple_tasks')
  await knex.schema.dropTableIfExists('todo_tables')
}
