import { TodoTable, TodoTableBase, TodoTree } from './todoTable.model'
import db from '../db'
import { Knex } from 'knex'
import { CRUDService } from '../common/CRUD/CRUD.service'
import simpleTaskService from '../simpleTask/simpleTask.service'
import { SimpleTask, SimpleTaskShort } from '../simpleTask/simpleTask.model'
import userService from '../user/user.service'

export class TodoTableService extends CRUDService<TodoTableBase, TodoTable> {
    public async getTree(
        tableId: number,
        modifier?: Knex.QueryCallbackWithArgs<any, any>,
    ): Promise<TodoTree> {
        const tasks = await simpleTaskService
            .getAll(modifier)
            .then((tasks) =>
                tasks.map(
                    (task) =>
                        new SimpleTaskShort(
                            task.id,
                            task.finishedAt,
                            task.deadline,
                            task.title,
                            task.priority,
                            task.parentId,
                        ),
                ),
            )
        const table = await this.get(tableId).then(
            (todotable) => new TodoTree(todotable.id, todotable.name, tasks),
        )
        return table
    }

    public get(id: number): Promise<TodoTable> {
        return super.get(id, async (record) => {
            const userIds = (
                (await db('users_todo_tables')
                    .select('user_id')
                    .where('todo_table_id', record.id)) as { userId: number }[]
            ).map((record) => record.userId)
            const users = await userService.getAll((query) =>
                query.whereIn('id', userIds),
            )
            return new TodoTable(
                record.id,
                record.createdAt,
                record.updatedAt,
                record.deletedAt,
                record.name,
                users,
            )
        })
    }
}

export default new TodoTableService('todo_tables')
