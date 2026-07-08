export class TodoTable {
    constructor(
        public id: number,
        public name: string,
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
 *          properties:
 *              name:
 *                  type: string
 *                  default: new todo table
 *              id:
 *                  type: number
 *                  default: 0
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
