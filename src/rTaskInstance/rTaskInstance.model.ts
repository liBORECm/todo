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
        public title: string,
        public description: string | null,
        public priority: TaskPriority,
        public deadline: Date | null,
    ) {
        super(id, createdAt, updatedAt, deletedAt, finishedAt)
    }
}
