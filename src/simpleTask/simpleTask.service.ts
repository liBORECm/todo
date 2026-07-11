import { FinishableService } from '../common/finishable/finishable.service'
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

    public edit(id: number, record: SimpleTask): Promise<boolean> {
        return super.edit(id, record, async () => {
            if (record.parentId !== null) {
                if (
                    ((await this.get(record.parentId)) === undefined) ===
                    undefined
                )
                    return false
            }

            return !(await this.isCyclicRec(record, id))
        })
    }

    public create(record: SimpleTask): Promise<SimpleTaskBase | undefined> {
        return super.create(record, async () => {
            if (record.parentId !== null) {
                if (
                    ((await this.get(record.parentId)) === undefined) ===
                    undefined
                )
                    return false
            }

            return true
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

    public finish(id: number): Promise<boolean> {
        return super.finish(id, async () => {
            const task = await this.get(id)
            if (task === undefined) return true

            for (const subtask of task.subtasks) {
                if (!(await this.isFinished(subtask.id))) return false
            }

            return true
        })
    }

    public get(id: number): Promise<SimpleTask | undefined> {
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
