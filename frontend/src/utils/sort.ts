import type { SimpleTaskBase } from '../types'
import type { SortField, SortDir } from '../components/SortBar'

const PRIORITY_RANK: Record<string, number> = {
    critical: 0,
    standard: 1,
    low: 2,
}

export function sortTasks(
    tasks: SimpleTaskBase[],
    field: SortField,
    dir: SortDir,
): SimpleTaskBase[] {
    const sign = dir === 'asc' ? 1 : -1
    return [...tasks].sort((a, b) => {
        switch (field) {
            case 'title':
                return sign * a.title.localeCompare(b.title)
            case 'priority':
                return (
                    sign *
                    (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
                )
            case 'deadline': {
                if (!a.deadline && !b.deadline) return 0
                if (!a.deadline) return 1
                if (!b.deadline) return -1
                return sign * (Date.parse(a.deadline) - Date.parse(b.deadline))
            }
            case 'createdAt':
                return (
                    sign * (Date.parse(a.createdAt) - Date.parse(b.createdAt))
                )
        }
    })
}
