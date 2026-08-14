import cron from 'node-cron'
import userService from '../user/user.service'
import simpleTaskService from '../simpleTask/simpleTask.service'
import { SimpleTaskBase, TaskPriority } from '../simpleTask/simpleTask.model'
import { RTaskInstance } from '../rTaskInstance/rTaskInstance.model'
import rTaskInstanceService from '../rTaskInstance/rTaskInstance.service'

const CLOSE_DEADLINE_MS = 24 * 60 * 60 * 1000

type NotifiableTask = {
    title: string
    priority: TaskPriority
    deadline: Date | null
}

function isUrgent(task: NotifiableTask): boolean {
    return (
        task.priority === TaskPriority.CRITICAL ||
        (task.deadline !== null &&
            task.deadline.getTime() - Date.now() <= CLOSE_DEADLINE_MS)
    )
}

function formatTask(task: NotifiableTask): string {
    const deadlineText = task.deadline
        ? ` (due ${task.deadline.toLocaleString('en-GB', {
              timeZone: 'Europe/Prague',
              dateStyle: 'short',
              timeStyle: 'short',
          })})`
        : ''
    const line = `${task.title}${deadlineText}`
    return isUrgent(task) ? `- **${line}** ⚠️` : `- ${line}`
}

class NotificationService {
    ntfyUrl: string

    constructor() {
        this.ntfyUrl = process.env.NTFY_URL ?? 'http://ntfy.liborec.eu'
        cron.schedule('0 7 * * *', () => this.sendNotifications(), {
            timezone: 'Europe/Prague',
        })
    }

    async sendNotifications() {
        for (const userId of (await userService.getAll()).map(
            (user) => user.id,
        )) {
            try {
                await this.sendNotification(userId)
            } catch (e) {
                console.log(e)
            }
        }
    }

    async sendNotification(userId: number) {
        const tableIds = (await userService.getTodoTables(userId)).map(
            (table) => table.id,
        )
        let allSimpleTasks: SimpleTaskBase[] = await simpleTaskService.getAll(
            (query) =>
                query
                    .whereIn('table_id', tableIds)
                    .whereNull('parent_id')
                    .whereNull('finished_at'),
        )
        let allRepeatedTasks: RTaskInstance[] =
            await rTaskInstanceService.getAll((query) =>
                query.whereIn('table_id', tableIds).whereNull('finished_at'),
            )

        const totalCount = allSimpleTasks.length + allRepeatedTasks.length
        if (totalCount === 0) return

        const sections: string[] = []
        if (allSimpleTasks.length > 0) {
            sections.push(
                ['**Tasks**', ...allSimpleTasks.map(formatTask)].join('\n'),
            )
        }
        if (allRepeatedTasks.length > 0) {
            sections.push(
                [
                    '**Repeated tasks**',
                    ...allRepeatedTasks.map(formatTask),
                ].join('\n'),
            )
        }

        const hasUrgent = [...allSimpleTasks, ...allRepeatedTasks].some(
            isUrgent,
        )

        await fetch(`${this.ntfyUrl}/todo-${userId}`, {
            method: 'POST',
            body: sections.join('\n\n'),
            headers: {
                Title: `${totalCount} unfinished task${totalCount === 1 ? '' : 's'}`,
                Priority: hasUrgent ? 'high' : 'default',
                Tags: hasUrgent ? 'rotating_light,clipboard' : 'clipboard',
                Markdown: 'yes',
            },
        })
    }
}

export default new NotificationService()
