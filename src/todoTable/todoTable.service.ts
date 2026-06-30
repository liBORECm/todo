import { TodoTable } from './todoTable.model'
import db from '../db'
import { Knex } from 'knex'
import { CRUDService } from '../CRUD/CRUD.service'

class TodoTableService extends CRUDService<TodoTable> {}

export default new TodoTableService('todo_tables')
