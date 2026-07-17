import { CronJob } from 'cron'
import { FinishableService } from '../common/finishable/finishable.service'
import repeatedTaskService from '../repeatedTask/repeatedTask.service'
import { RTaskInstance } from './rTaskInstance.model'

export class RTaskInstanceService extends FinishableService<
    RTaskInstance,
    RTaskInstance
> {
    private jobs: CronJob[] = []

    constructor(tableName: string) {
        super(tableName)
        this.instantiate()
        // #region AI-GENERATED
        // Arrow function preserves `this` so the hook can call instantiate correctly
        repeatedTaskService.registerMutationHook(() => this.instantiate())
        // #endregion
    }

    async instantiate() {
        for (const job of this.jobs) {
            job.stop()
        }
        this.jobs = []

        const tasks = await repeatedTaskService.getAll()

        for (const task of tasks) {
            const job = new CronJob(
                task.cron,
                async () => {
                    // #region AI-GENERATED
                    // getDate() returns day-of-month (1–31); use getTime() + ms-per-day to get a real future date
                    const deadline = new Date(
                        Date.now() + task.duration * 24 * 60 * 60 * 1000,
                    )
                    // #endregion
                    const rTaskInstance = new RTaskInstance(
                        0,
                        new Date(),
                        new Date(),
                        null,
                        null,
                        task.tableId,
                        task.title,
                        task.description,
                        task.priority,
                        deadline,
                    )
                    await this.create(rTaskInstance)
                },
                null,
                true,
                'Europe/Prague',
            )
            this.jobs.push(job)
        }
    }
}

export default new RTaskInstanceService('repeated_task_instances')
