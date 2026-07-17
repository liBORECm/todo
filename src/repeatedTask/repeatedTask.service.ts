import { isValidCron } from 'cron-validator'
import { CRUDService } from '../common/CRUD/CRUD.service'
import HttpError, { InvaliadCRON, InvalidDuration } from '../common/httpError'
import { RepeatedTask } from './repeatedTask.model'

export class RepeatedTaskService extends CRUDService<
    RepeatedTask,
    RepeatedTask
> {
    private onMutated: (() => void) | null = null

    public registerMutationHook(cb: () => void) {
        this.onMutated = cb
    }

    public async delete(
        id: number,
        approveDelete?: () => Promise<void>,
    ): Promise<boolean> {
        const result = await super.delete(id, approveDelete)
        this.onMutated?.()
        return result
    }

    public async create(
        record: RepeatedTask,
        approveCreate?: () => Promise<void>,
    ): Promise<RepeatedTask> {
        const result = await super.create(record, async () => {
            const cron = record.cron
            if (cron.split(' ').length !== 5) throw new HttpError(InvaliadCRON)

            const cronMidnight = '0 0 ' + cron.split(' ').slice(2).join(' ')
            if (!isValidCron(cronMidnight)) throw new HttpError(InvaliadCRON)

            record.cron = cronMidnight

            if (record.duration < 1) throw new HttpError(InvalidDuration)
            if (Math.round(record.duration) !== record.duration)
                throw new HttpError(InvalidDuration)
        })
        this.onMutated?.()
        return result
    }

    public async edit(
        id: number,
        record: RepeatedTask,
        approveEdit?: () => Promise<void>,
    ): Promise<RepeatedTask> {
        const result = await super.edit(id, record, async () => {
            const cron = record.cron
            if (cron !== undefined) {
                if (cron.split(' ').length !== 5)
                    throw new HttpError(InvaliadCRON)

                const cronMidnight = '0 0 ' + cron.split(' ').slice(2).join(' ')
                if (!isValidCron(cronMidnight))
                    throw new HttpError(InvaliadCRON)

                record.cron = cronMidnight
            }

            if (record.duration !== undefined) {
                if (record.duration < 1) throw new HttpError(InvalidDuration)
                if (Math.round(record.duration) !== record.duration)
                    throw new HttpError(InvalidDuration)
            }
        })
        this.onMutated?.()
        return result
    }
}

export default new RepeatedTaskService('repeated_tasks')
