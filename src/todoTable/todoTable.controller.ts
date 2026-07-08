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

/**
 * @swagger
 * /api/v1/todo-table:
 *  get:
 *      tags:
 *          - Todo table
 *      summary: Get all todo tables
 *      parameters:
 *          - name: sort
 *            in: query
 *            schema:
 *              type: string
 *            description: Select a attirbute you want result to be sorted by. If you want it sorted descanding, add a prefix '-'
 *          - name: offset
 *            in: query
 *            schema:
 *              type: number
 *          - name: limit
 *            in: query
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: A list of todo tables.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/TodoTable'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 *  post:
 *      tags:
 *          - Todo table
 *      summary: Create new todo table
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TodoTableInput'
 *      responses:
 *          200:
 *              description: Created todo table.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoTable'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 * /api/v1/todo-table/{id}:
 *  get:
 *      tags:
 *          - Todo table
 *      summary: Gets one todo table by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a todo table
 *            required: true
 *      responses:
 *          200:
 *              description: Selected todo table
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoTable'
 *          500:
 *              description: Internal error
 *              content:
 *                  appliaction/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotFoundError'
 */
