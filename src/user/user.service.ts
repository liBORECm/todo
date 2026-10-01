import { Knex } from 'knex'
import { CRUDService } from '../common/CRUD/CRUD.service'
import db from '../db'
import { User } from './user.model'
import { TodoTableBase } from '../todoTable/todoTable.model'
import todoTableService from '../todoTable/todoTable.service'
import simpleTaskService from '../simpleTask/simpleTask.service'
import rTaskInstanceService from '../rTaskInstance/rTaskInstance.service'
import { isUrgent } from '../common/taskUrgency'

export type TodoTableTaskCounts = {
    tableId: number
    urgentCount: number
    normalCount: number
}

class UserService extends CRUDService<User, User> {
    public async getTodoTables(
        userId: number,
        modifier?: Knex.QueryCallbackWithArgs<any, any>,
        sort?: { attribute: string; order: 'ASC' | 'DESC' },
        offset?: number,
        limit?: number,
    ) {
        let query = db('todo_tables')
            .innerJoin(
                'users_todo_tables',
                'users_todo_tables.todo_table_id',
                'todo_tables.id',
            )
            .where('deleted_at', null)
            .where('user_id', userId)

        if (modifier !== undefined) query = query.modify(modifier)
        if (sort !== undefined)
            query = query.orderBy(sort.attribute, sort.order)
        if (offset !== undefined) query = query.offset(offset)
        if (limit !== undefined) query = query.limit(limit)

        return (await query) as Array<TodoTableBase>
    }

    public async getTodoTableTaskCounts(
        userId: number,
    ): Promise<TodoTableTaskCounts[]> {
        const tableIds = (await this.getTodoTables(userId)).map(
            (table) => table.id,
        )

        const counts = new Map<number, TodoTableTaskCounts>(
            tableIds.map((tableId) => [
                tableId,
                { tableId, urgentCount: 0, normalCount: 0 },
            ]),
        )
        if (tableIds.length === 0) return []

        const allSimpleTasks = await simpleTaskService.getAll((query) =>
            query
                .whereIn('table_id', tableIds)
                .whereNull('parent_id')
                .whereNull('finished_at'),
        )
        const allRepeatedTasks = await rTaskInstanceService.getAll((query) =>
            query.whereIn('table_id', tableIds).whereNull('finished_at'),
        )

        for (const task of [...allSimpleTasks, ...allRepeatedTasks]) {
            const entry = counts.get(task.tableId)
            if (entry === undefined) continue
            if (isUrgent(task)) entry.urgentCount++
            else entry.normalCount++
        }

        return Array.from(counts.values())
    }

    public async setJoinedTodoTables(userId: number, todoTableIds: number[]) {
        for (const todoTableId of todoTableIds) {
            await todoTableService.get(todoTableId) //throws error if doesnt exist
        }

        await this.get(userId) // also throws error

        await db('users_todo_tables').where('user_id', userId).del()
        for (const todoTableId of todoTableIds) {
            await db('users_todo_tables').insert({
                user_id: userId,
                todo_table_id: todoTableId,
            })
        }
    }
}

export type { UserService }
export default new UserService('users')
