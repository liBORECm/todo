import express, { Router } from 'express'
import CRUDController from '../common/CRUD/CRUD.controller'
import { RepeatedTask } from './repeatedTask.model'
import repeatedTaskService, {
    RepeatedTaskService,
} from './repeatedTask.service'

class RepeatedTaskController extends CRUDController<
    RepeatedTask,
    RepeatedTask,
    RepeatedTaskService
> {
    constructor() {
        super(repeatedTaskService)
    }

    public routes(): Router {
        const router = super.routes()

        const router0 = express.Router()
        router0.use('/repeated-task', router)
        return router0
    }
}

export default new RepeatedTaskController().routes()

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/repeated-task:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - Repeated task
 *      summary: Get all repeated tasks
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
 *              description: A list of repeated tasks.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/RepeatedTask'
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
 *          - Repeated task
 *      summary: Create new repeated task
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RepeatedTaskInput'
 *      responses:
 *          200:
 *              description: Created repeated task.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RepeatedTask'
 *          400:
 *              description: Invalid cron expression or duration is not a positive integer
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
 *
 * /api/v1/repeated-task/{id}:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - Repeated task
 *      summary: Get one repeated task by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Selected repeated task
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RepeatedTask'
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
 *          - Repeated task
 *      summary: Update a repeated task by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task
 *            required: true
 *            schema:
 *              type: number
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RepeatedTaskPatchInput'
 *      responses:
 *          200:
 *              description: Updated repeated task
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RepeatedTask'
 *          400:
 *              description: Invalid cron expression or duration is not a positive integer
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/BadRequestError'
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
 *          - Repeated task
 *      summary: Delete a repeated task by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Repeated task deleted successfully
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
