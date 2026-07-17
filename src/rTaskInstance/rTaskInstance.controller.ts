import express, { Router } from 'express'
import FinishableController from '../common/finishable/finishable.controller'
import { RTaskInstance } from './rTaskInstance.model'
import rTaskInstanceService, {
    RTaskInstanceService,
} from './rTaskInstance.service'

class RTaskInstanceController extends FinishableController<
    RTaskInstance,
    RTaskInstance,
    RTaskInstanceService
> {
    constructor() {
        super(rTaskInstanceService)
    }

    public routes(): Router {
        const router = super.routes()

        const router0 = express.Router()
        router0.use('/r-task-instances', router)
        return router0
    }
}

export default new RTaskInstanceController().routes()

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * /api/v1/r-task-instances:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - R task instance
 *      summary: Get all repeated task instances
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
 *              description: A list of repeated task instances.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/RTaskInstanceBase'
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
 *          - R task instance
 *      summary: Create new repeated task instance
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RTaskInstanceInput'
 *      responses:
 *          200:
 *              description: Created repeated task instance.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RTaskInstanceBase'
 *          500:
 *              description: Internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InternalError'
 *
 * /api/v1/r-task-instances/{id}:
 *  get:
 *      x-ai-generated: true
 *      tags:
 *          - R task instance
 *      summary: Get one repeated task instance by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task instance
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Selected repeated task instance
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RTaskInstanceBase'
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
 *          - R task instance
 *      summary: Update a repeated task instance by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task instance
 *            required: true
 *            schema:
 *              type: number
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RTaskInstancePatchInput'
 *      responses:
 *          200:
 *              description: Updated repeated task instance
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RTaskInstanceBase'
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
 *          - R task instance
 *      summary: Delete a repeated task instance by id
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task instance
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Repeated task instance deleted successfully
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
 * /api/v1/r-task-instances/finish/{id}:
 *  post:
 *      x-ai-generated: true
 *      tags:
 *          - R task instance
 *      summary: Mark a repeated task instance as finished
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Id of a repeated task instance
 *            required: true
 *            schema:
 *              type: number
 *      responses:
 *          200:
 *              description: Repeated task instance marked as finished
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RTaskInstanceBase'
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
