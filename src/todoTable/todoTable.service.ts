import { TodoTable } from './todoTabl.emodel'
import db from '../db'

class TodoTableService {
  public async getAll(): Promise<Array<TodoTable>> {
    return (await db('todo_tables').select()) as Array<TodoTable>
  }

  public async get(id: number): Promise<TodoTable> {
    return (await db('todo_tables').where('id', id).first()) as TodoTable
  }

  public async create(table: TodoTable): Promise<boolean> {
    ;(table as any).id = undefined
    const result = await db('todo_tables').insert(table)
    return result.length == 1
  }

  public async edit(id: number, table: TodoTable): Promise<boolean> {
    ;(table as any).id = undefined
    const result = await db('todo_tables').where('id', id).update(table)
    return result == 1
  }

  public async delete(id: number): Promise<boolean> {
    const result = await db('todo_tables').where('id', id).delete()

    return result == 1
  }
}

export default new TodoTableService()
