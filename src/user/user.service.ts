import { Knex } from 'knex'
import { CRUDService } from '../common/CRUD/CRUD.service'
import db from '../db'
import { User } from './user.model'
import { TodoTable } from '../todoTable/todoTable.model'
import todoTableService from '../todoTable/todoTable.service'

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

        return (await query) as Array<TodoTable>
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
