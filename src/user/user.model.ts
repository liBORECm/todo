import { CRUDEntity } from '../common/CRUD/CRUD.model'

export class User extends CRUDEntity {
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

// #region AI-GENERATED SWAGGER
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - id
 *              - createdAt
 *              - updatedAt
 *              - name
 *          properties:
 *              id:
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
 *              name:
 *                  type: string
 *
 *      UserInput:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *
 *      UserPatchInput:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *
 */
// #endregion
