import { FinishalbeEntity } from '../common/finishable/finishable.model'
import { RepeatedTask } from '../repeatedTask/repeatedTask.model'

export class RTaskInstance extends FinishalbeEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
        public finishedAt: Date | null,
        public tableId: number,
        public title: string,
        public description: string | null,
        public priority: TaskPriority,
        public deadline: Date | null,
    ) {
        super(id, createdAt, updatedAt, deletedAt, finishedAt)
    }
}

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * components:
 *  schemas:
 *      RTaskInstance:
 *          type: object
 *          required:
 *              - id
 *              - tableId
 *              - createdAt
 *              - updatedAt
 *              - title
 *              - priority
 *          properties:
 *              id:
 *                  type: number
 *              tableId:
 *                  type: number
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *              deletedAt:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *              finishedAt:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *                  nullable: true
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              deadline:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *
 *      RTaskInstanceInput:
 *          type: object
 *          required:
 *              - tableId
 *              - title
 *          properties:
 *              tableId:
 *                  type: number
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *                  nullable: true
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              deadline:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *
 *      RTaskInstancePatchInput:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *                  nullable: true
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              deadline:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *
 */
// #endregion
