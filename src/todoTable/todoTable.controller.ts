import express, { Router } from 'express'
import CRUDController from '../common/CRUD/CRUD.controller'
import { TodoTable } from './todoTable.model'
import todoTableService, { TodoTableService } from './todoTable.service'
import { CRUDService } from '../common/CRUD/CRUD.service'
import { Knex } from 'knex'
import { InternalError, isHttpError } from '../common/httpError'

class todoTableController extends CRUDController<
    TodoTable,
    TodoTable,
    TodoTableService
> {
    constructor() {
        super(todoTableService)
    }

    public routes(): Router {
        const router = super.routes()

        router.get('/tree/:id', async (req, res) => {
            const id = Number(req.params.id)
            const modifier = (query: Knex.QueryBuilder) => {
                for (const [column, value] of Object.entries(req.query)) {
                    query = query.where(column, value)
                }

                return query
            }

            try {
                const result = await this.service.getTree(id, modifier)
                return res.status(200).json(result)
            } catch (e) {
                console.log(e)
                if (isHttpError(e))
                    return res.status(e.status).json({ error: e.message })

                const { status, message } = InternalError
                return res.status(status).json({ error: message })
            }
        })

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
 *            description: Select an attribute you want result to be sorted by. If you want it sorted descending, add a prefix '-'
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
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Selected todo table
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoTable'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotFoundError'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 */

/**
 * @swagger
 * /api/v1/todo-table/tree/{id}:
 *  get:
 *      tags:
 *          - Todo table
 *      summary: Get a todo table with its tasks as a tree
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a todo table
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Todo table with nested tasks
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoTree'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotFoundError'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 */

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/todo-table/{id}:
 *  patch:
 *      tags:
 *          - Todo table
 *      summary: Update a todo table by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a todo table
 *            required: true
 *            schema:
 *              type: number
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TodoTablePatchInput'
 *      responses:
 *          200:
 *              description: Updated todo table
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoTable'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotFoundError'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *  delete:
 *      tags:
 *          - Todo table
 *      summary: Delete a todo table by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a todo table
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Todo table deleted successfully
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotFoundError'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 */
// #endregion
