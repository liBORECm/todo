import { CRUDEntity } from '../common/CRUD/CRUD.model'

export class RepeatedTask extends CRUDEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public tableId: number,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public cron: string,
        public duration: number,
    ) {
        super(id, createdAt, updatedAt, deletedAt)
    }
}

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * components:
 *  schemas:
 *      RepeatedTask:
 *          type: object
 *          required:
 *              - id
 *              - tableId
 *              - createdAt
 *              - updatedAt
 *              - title
 *              - priority
 *              - cron
 *              - duration
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
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              cron:
 *                  type: string
 *                  description: Cron expression defining the repetition schedule
 *              duration:
 *                  type: number
 *                  description: Duration of the task in days
 *
 *      RepeatedTaskInput:
 *          type: object
 *          required:
 *              - tableId
 *              - title
 *              - cron
 *              - duration
 *          properties:
 *              tableId:
 *                  type: number
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              cron:
 *                  type: string
 *                  description: Cron expression defining the repetition schedule
 *              duration:
 *                  type: number
 *                  description: Duration of the task in days
 *
 *      RepeatedTaskPatchInput:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              cron:
 *                  type: string
 *                  description: Cron expression defining the repetition schedule
 *              duration:
 *                  type: number
 *                  description: Duration of the task in days
 *
 */
// #endregion
