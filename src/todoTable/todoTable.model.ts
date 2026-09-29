import { CRUDEntity } from '../common/CRUD/CRUD.model'
import { SimpleTaskShort } from '../simpleTask/simpleTask.model'
import { User } from '../user/user.model'

export class TodoTableBase extends CRUDEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public name: string,
        public silent: boolean,
    ) {
        super(id, createdAt, updatedAt, deletedAt)
    }
}

export class TodoTable extends TodoTableBase {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public name: string,
        public silent: boolean,
        public users: User[],
    ) {
        super(id, createdAt, updatedAt, deletedAt, name, silent)
    }
}

export class TodoTree {
    constructor(
        public id: number,
        public name: string,
        public tasks: SimpleTaskShort[],
    ) {}
}

// #region AI-GENERATED SWAGGER
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
 *      TodoTableBase:
 *          type: object
 *          required:
 *              - name
 *              - id
 *              - createdAt
 *              - updatedAt
 *              - silent
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
 *              silent:
 *                  type: boolean
 *                  default: false
 *
 *      TodoTable:
 *          allOf:
 *              - $ref: '#/components/schemas/TodoTableBase'
 *              - type: object
 *                required:
 *                    - users
 *                properties:
 *                    users:
 *                        type: array
 *                        items:
 *                            $ref: '#/components/schemas/User'
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
