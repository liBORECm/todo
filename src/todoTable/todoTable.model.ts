import { CRUDEntity } from '../common/CRUD/CRUD.model'
import { SimpleTaskShort } from '../simpleTask/simpleTask.model'

export class TodoTable extends CRUDEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public name: string,
    ) {
        super(id, createdAt, updatedAt, deletedAt)
    }
}

export class TodoTree {
    constructor(
        public id: number,
        public name: string,
        public tasks: SimpleTaskShort[],
    ) {}
}

/**
 * @swagger
 * components:
 *  schemas:
 *      TodoTableInput:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  default: new todo table
 *
 *      TodoTable:
 *          type: object
 *          required:
 *              - name
 *              - id
 *              - createdAt
 *              - updatedAt
 *          properties:
 *              name:
 *                  type: string
 *                  default: new todo table
 *              id:
 *                  type: number
 *                  default: 0
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
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      TodoTree:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - tasks
 *          properties:
 *              id:
 *                  type: number
 *              name:
 *                  type: string
 *              tasks:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/SimpleTaskShort'
 */

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * components:
 *  schemas:
 *      TodoTablePatchInput:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  default: new todo table
 */
