import { FinishalbeEntity } from '../common/finishable/finishable.model'

export enum TaskPriority {
    CRITICAL = 'critical',
    STANDARD = 'standard',
    LOW = 'low',
}

export class SimpleTaskBase extends FinishalbeEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
        public tableId: number,
        public deadline: Date,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public parentId: number | null,
    ) {
        super(id, createdAt, updatedAt, deletedAt, finishedAt)
    }
}

export class SimpleTask extends SimpleTaskBase {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
        public tableId: number,
        public deadline: Date,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public parentId: number | null,
        public subtasks: SimpleTaskBase[],
    ) {
        super(
            id,
            createdAt,
            updatedAt,
            deletedAt,
            finishedAt,
            tableId,
            deadline,
            title,
            description,
            priority,
            parentId,
        )
    }
}

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * components:
 *  schemas:
 *      TaskPriority:
 *          type: string
 *          enum:
 *              - critical
 *              - standard
 *              - low
 *
 *      SimpleTaskBase:
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
 *              deadline:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              parentId:
 *                  type: number
 *                  nullable: true
 *
 *      SimpleTask:
 *          allOf:
 *              - $ref: '#/components/schemas/SimpleTaskBase'
 *              - type: object
 *                properties:
 *                    subtasks:
 *                        type: array
 *                        items:
 *                            $ref: '#/components/schemas/SimpleTaskBase'
 *
 *      SimpleTaskInput:
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
 *              deadline:
 *                  type: string
 *                  format: date-time
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              parentId:
 *                  type: number
 *                  nullable: true
 *
 *      SimpleTaskPatchInput:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *              description:
 *                  type: string
 *              deadline:
 *                  type: string
 *                  format: date-time
 *              priority:
 *                  $ref: '#/components/schemas/TaskPriority'
 *              parentId:
 *                  type: number
 *                  nullable: true
 */
// #endregion
