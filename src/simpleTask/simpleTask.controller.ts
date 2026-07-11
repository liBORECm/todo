import FinishableController from '../common/finishable/finishable.controller'
import { FinishableService } from '../common/finishable/finishable.service'
import { SimpleTask, SimpleTaskBase } from './simpleTask.model'
import simpleTaskService from './simpleTask.service'
import express, { Router } from 'express'

class SimpleTaskController extends FinishableController<
    SimpleTaskBase,
    SimpleTask,
    FinishableService<SimpleTaskBase, SimpleTask>
> {
    constructor() {
        super(simpleTaskService)
    }

    public routes(): Router {
        const router = super.routes()

        const router0 = express.Router()
        router0.use('/simple-task', router)
        return router0
    }
}

export default new SimpleTaskController().routes()

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/simple-task:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - Simple task
 *      summary: Get all simple tasks
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
 *              description: A list of simple tasks.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/SimpleTask'
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
 *          - Simple task
 *      summary: Create new simple task
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SimpleTaskInput'
 *      responses:
 *          200:
 *              description: Created simple task.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SimpleTask'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 * /api/v1/simple-task/{id}:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - Simple task
 *      summary: Get one simple task by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a simple task
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Selected simple task
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SimpleTask'
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
 *          - Simple task
 *      summary: Update a simple task by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a simple task
 *            required: true
 *            schema:
 *              type: number
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SimpleTaskPatchInput'
 *      responses:
 *          200:
 *              description: Updated simple task
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SimpleTask'
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
 *          - Simple task
 *      summary: Delete a simple task by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a simple task
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Simple task deleted successfully
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
 * /api/v1/simple-task/finish/{id}:
 *  post:
 *      x-ai-generated: true
 *      tags:
 *          - Simple task
 *      summary: Mark a simple task as finished
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a simple task
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Simple task marked as finished
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
