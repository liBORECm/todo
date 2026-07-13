import { TodoTable, TodoTree } from './todoTable.model'
import db from '../db'
import { Knex } from 'knex'
import { CRUDService } from '../common/CRUD/CRUD.service'
import simpleTaskService from '../simpleTask/simpleTask.service'
import { SimpleTask, SimpleTaskShort } from '../simpleTask/simpleTask.model'

export class TodoTableService extends CRUDService<TodoTable, TodoTable> {
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
}

export default new TodoTableService('todo_tables')
