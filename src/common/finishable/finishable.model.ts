import { CRUDEntity } from '../CRUD/CRUD.model'

export abstract class FinishalbeEntity extends CRUDEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
    ) {
        super(id, createdAt, updatedAt, deletedAt)
    }
}
