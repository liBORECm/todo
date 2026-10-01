import express, { Request, Response, Router } from 'express'
import CRUDController from '../common/CRUD/CRUD.controller'
import { CRUDService } from '../common/CRUD/CRUD.service'
import { User } from './user.model'
import userService, { UserService } from './user.service'
import { Knex } from 'knex'
import { BadRequest, InternalError, isHttpError } from '../common/httpError'
import { json } from 'node:stream/consumers'

class UserController extends CRUDController<User, User, UserService> {
    constructor() {
        super(userService)
    }

    public routes(): Router {
        const router = super.routes()

        router.get('/tables/:userId', async (req: Request, res: Response) => {
            const { sort: presort, offset, limit, ...filters } = req.query
            const attribute =
                !presort || typeof presort !== 'string'
                    ? undefined
                    : presort[0] === '-'
                      ? presort.substring(1)
                      : presort
            const order =
                !presort || typeof presort !== 'string'
                    ? undefined
                    : presort[0] !== '-'
                      ? 'ASC'
                      : 'DESC'

            const sort =
                attribute !== undefined && order !== undefined
                    ? { attribute, order: order as 'ASC' | 'DESC' }
                    : undefined

            const modifier = (query: Knex.QueryBuilder) => {
                for (const [column, value] of Object.entries(filters)) {
                    query = query.where(column, value)
                }

                return query
            }

            try {
                const tables = await this.service.getTodoTables(
                    Number(req.params.userId),
                    modifier,
                    sort,
                    Number(offset),
                    Number(limit),
                )
                return res.status(200).json(tables)
            } catch (e) {
                console.log(e)
                if (isHttpError(e))
                    return res.status(e.status).json({ error: e.message })

                const { status, message } = InternalError
                return res.status(status).json({ error: message })
            }
        })

        router.get(
            '/tables/:userId/counts',
            async (req: Request, res: Response) => {
                try {
                    const counts = await this.service.getTodoTableTaskCounts(
                        Number(req.params.userId),
                    )
                    return res.status(200).json(counts)
                } catch (e) {
                    console.log(e)
                    if (isHttpError(e))
                        return res.status(e.status).json({ error: e.message })

                    const { status, message } = InternalError
                    return res.status(status).json({ error: message })
                }
            },
        )

        router.post(
            '/setTables/:userId',
            async (req: Request, res: Response) => {
                try {
                    const tableIds = JSON.parse(req.query.tables as string)
                    if (!Array.isArray(tableIds)) throw BadRequest
                    for (const tableId of tableIds) {
                        if (typeof tableId !== 'number') throw BadRequest
                    }

                    await this.service.setJoinedTodoTables(
                        Number(req.params.userId),
                        tableIds,
                    )
                    return res.sendStatus(200)
                } catch (e) {
                    console.log(e)
                    if (isHttpError(e))
                        return res.status(e.status).json({ error: e.message })

                    const { status, message } = InternalError
                    return res.status(status).json({ error: message })
                }
            },
        )

        const router0 = express.Router()
        router0.use('/user', router)
        return router0
    }
}

export default new UserController().routes()

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/user:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Get all users
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
 *              description: A list of users.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 *  post:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Create new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserInput'
 *      responses:
 *          200:
 *              description: Created user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 * /api/v1/user/{id}:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Get one user by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a user
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Selected user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
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
 *
 *  patch:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Update a user by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a user
 *            required: true
 *            schema:
 *              type: number
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserPatchInput'
 *      responses:
 *          200:
 *              description: Updated user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
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
 *
 *  delete:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Delete a user by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a user
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: User deleted successfully
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

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/user/tables/{userId}:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Get the todo tables joined to a user
 *      parameters:
 *          - name: userId
 *            in: path
 *            description: Id of the user
 *            required: true
 *            schema:
 *              type: number
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
 *              description: A list of todo tables joined to the user.
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
 * /api/v1/user/tables/{userId}/counts:
 *  get:
 *      tags:
 *          - User
 *      summary: Get unfinished task counts per todo table joined to a user
 *      parameters:
 *          - name: userId
 *            in: path
 *            description: Id of the user
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Urgent/normal unfinished task counts per todo table.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  tableId:
 *                                      type: number
 *                                  urgentCount:
 *                                      type: number
 *                                  normalCount:
 *                                      type: number
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 * /api/v1/user/setTables/{userId}:
 *  post:
 *      x-ai-generated: true
 *      tags:
 *          - User
 *      summary: Set the todo tables joined to a user
 *      parameters:
 *          - name: userId
 *            in: path
 *            description: Id of the user
 *            required: true
 *            schema:
 *              type: number
 *          - name: tables
 *            in: query
 *            description: JSON-encoded array of todo table ids to join to the user
 *            required: true
 *            schema:
 *              type: string
 *              default: "[1,2,3]"
 *      responses:
 *          200:
 *              description: Todo tables joined successfully
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/BadRequestError'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 */
// #endregion
