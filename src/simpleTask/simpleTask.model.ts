export enum TaskPriority {
    CRITICAL = 'critical',
    STANDARD = 'standard',
    LOW = 'low',
}

export class SimpleTaskBase {
    constructor(
        public id: number,
        public tableId: number,
        public name: string,
        public createdAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
        public deadline: Date,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public parentId: number | null,
    ) {}
}

export class SimpleTask extends SimpleTaskBase {
    constructor(
        public id: number,
        public tableId: number,
        public name: string,
        public createdAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
        public deadline: Date,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public parentId: number | null,
        public subtasks: SimpleTaskBase[],
    ) {
        super(
            id,
            tableId,
            name,
            createdAt,
            deletedAt,
            finishedAt,
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
 *              - name
 *              - createdAt
 *              - title
 *              - priority
 *          properties:
 *              id:
 *                  type: number
 *              tableId:
 *                  type: number
 *              name:
 *                  type: string
 *              createdAt:
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
 *              - name
 *              - title
 *          properties:
 *              tableId:
 *                  type: number
 *              name:
 *                  type: string
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
 *              name:
 *                  type: string
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
