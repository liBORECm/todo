import { isValidCron } from 'cron-validator'
import { CRUDService } from '../common/CRUD/CRUD.service'
import HttpError, { InvaliadCRON, InvalidDuration } from '../common/httpError'
import { RepeatedTask } from './repeatedTask.model'

export class RepeatedTaskService extends CRUDService<
    RepeatedTask,
    RepeatedTask
> {
    public create(
        record: RepeatedTask,
        approveCreate?: () => Promise<void>,
    ): Promise<RepeatedTask> {
        return super.create(record, async () => {
            const cron = record.cron
            if (cron.split(' ').length !== 5) throw new HttpError(InvaliadCRON)

            const cronMidnight = '0 0 ' + cron.split(' ').slice(2).join(' ')
            if (!isValidCron(cronMidnight)) throw new HttpError(InvaliadCRON)

            record.cron = cronMidnight

            if (record.duration < 1) throw new HttpError(InvalidDuration)
            if (Math.round(record.duration) !== record.duration)
                throw new HttpError(InvalidDuration)
        })
    }

    public edit(
        id: number,
        record: RepeatedTask,
        approveEdit?: () => Promise<void>,
    ): Promise<RepeatedTask> {
        return super.edit(id, record, async () => {
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
    }
}

export default new RepeatedTaskService('repeated_tasks')
