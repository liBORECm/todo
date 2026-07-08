export declare class TodoTable {
    public id: number
    public name: string

    constructor(id: number, name: string)
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
 *          properties:
 *              name:
 *                  type: string
 *                  default: new todo table
 *              id:
 *                  type: number
 *                  default: 0
 */
