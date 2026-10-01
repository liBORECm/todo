import { TaskPriority } from '../simpleTask/simpleTask.model'

export const CLOSE_DEADLINE_MS = 24 * 60 * 60 * 1000

export type UrgencyInput = {
    priority: TaskPriority
    deadline: Date | null
}

export function isUrgent(task: UrgencyInput): boolean {
    return (
        task.priority === TaskPriority.CRITICAL ||
        (task.deadline !== null &&
            task.deadline.getTime() - Date.now() <= CLOSE_DEADLINE_MS)
    )
}
