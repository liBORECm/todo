import express, { Router } from 'express'
import CRUDController from '../CRUD/CRUD.controller'
import { TodoTable } from './todoTable.model'
import todoTableService from './todoTable.service'

class todoTableController extends CRUDController<TodoTable> {
    constructor() {
        super(todoTableService)
    }

    public routes(): Router {
        const router = super.routes()

        const router0 = express.Router()
        router0.use('/todo-table', router)
        return router0
    }
}

export default new todoTableController().routes()
