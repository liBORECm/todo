import { FinishalbeEntity } from '../common/finishable/finishable.model'
import { RepeatedTask } from '../repeatedTask/repeatedTask.model'

export class RTaskInstanceBase extends FinishalbeEntity {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
        public finishedAt: Date | null,
        public tableId: number,
        public repeatedTaskId: number,
    ) {
        super(id, createdAt, updatedAt, deletedAt, finishedAt)
    }
}

export class RTaskInstance extends RTaskInstanceBase {
    constructor(
        public id: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
        public finishedAt: Date | null,
        public tableId: number,
        public repeatedTaskId: number,
        public repeatedTask: RepeatedTask,
    ) {
        super(
            id,
            createdAt,
            updatedAt,
            deletedAt,
            finishedAt,
            tableId,
            repeatedTaskId,
        )
    }
}
