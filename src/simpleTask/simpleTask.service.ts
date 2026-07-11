import { EntityName } from 'typescript'
import { FinishableService } from '../common/finishable/finishable.service'
import HttpError, {
    CannotCreateCycles,
    ParentDoesntExist,
    UnfinishedSubtask,
} from '../common/HttpError'
import { SimpleTask, SimpleTaskBase } from './simpleTask.model'

class SimpleTaskService extends FinishableService<SimpleTaskBase, SimpleTask> {
    private async getParent(
        simpleTask: SimpleTask,
    ): Promise<SimpleTask | undefined> {
        if (simpleTask.parentId === null) return undefined

        return await this.get(simpleTask.parentId)
    }

    // private async isCyclic(id: number) : Promise<boolean> {
    //     const simpleTask = await this.get(id)
    //     if(!simpleTask) return false

    //     return await this.isCyclicRec(simpleTask, id)
    // }

    private async isCyclicRec(
        simpleTask: SimpleTask,
        initialId: number,
    ): Promise<boolean> {
        const parent = await this.getParent(simpleTask)
        if (parent === undefined) return false
        if (parent.id === initialId) return true
        return this.isCyclicRec(parent, initialId)
    }

    public edit(id: number, record: SimpleTask): Promise<SimpleTask> {
        return super.edit(id, record, async () => {
            record.tableId === undefined

            if (record.parentId !== null) {
                if (
                    ((await this.get(record.parentId)) === undefined) ===
                    undefined
                )
                    throw new HttpError(ParentDoesntExist)
            }

            if (await this.isCyclicRec(record, id))
                throw new HttpError(CannotCreateCycles)
        })
    }

    public create(record: SimpleTask): Promise<SimpleTaskBase> {
        return super.create(record, async () => {
            if (record.parentId !== null) {
                if (
                    ((await this.get(record.parentId)) === undefined) ===
                    undefined
                )
                    throw new HttpError(ParentDoesntExist)
            }
        })
    }

    /**
     * Checking if is all of the subtasks are finished recursively
     * @param id id of a simpleTask
     */
    public async isFinished(id: number): Promise<boolean> {
        const task = await this.get(id)
        if (task === undefined) return true

        for (const subtask of task.subtasks) {
            if (!(await this.isFinished(subtask.id))) return false
        }

        return task.finishedAt !== null
    }

    public finish(id: number): Promise<SimpleTask> {
        return super.finish(id, async () => {
            const task = await this.get(id)

            for (const subtask of task.subtasks) {
                if (!(await this.isFinished(subtask.id)))
                    throw new HttpError(UnfinishedSubtask)
            }
        })
    }

    public get(id: number): Promise<SimpleTask> {
        return super.get(id, async (baseTask) => {
            const subtasks = await this.getAll((query) =>
                query.where('parentId', baseTask.id),
            )

            return new SimpleTask(
                baseTask.id,
                baseTask.createdAt,
                baseTask.updatedAt,
                baseTask.deletedAt,
                baseTask.finishedAt,
                baseTask.tableId,
                baseTask.deadline,
                baseTask.title,
                baseTask.description,
                baseTask.priority,
                baseTask.parentId,
                subtasks,
            )
        })
    }
}

export default new SimpleTaskService('simple_tasks')
