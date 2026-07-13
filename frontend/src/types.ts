export type TaskPriority = 'critical' | 'standard' | 'low'

export interface TodoTable {
    id: number
    name: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export interface SimpleTaskBase {
    id: number
    tableId: number
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    finishedAt: string | null
    deadline: string | null
    title: string
    description?: string
    priority: TaskPriority
    parentId: number | null
}

export interface SimpleTask extends SimpleTaskBase {
    subtasks: SimpleTaskBase[]
}

export interface SimpleTaskInput {
    tableId: number
    title: string
    description?: string
    deadline?: string
    priority?: TaskPriority
    parentId?: number | null
}

export interface TreeTask {
    id: number
    title: string
    priority: TaskPriority
    finishedAt: string | null
    deadline: string | null
    parentId: number | null
}

export interface TodoTreeResponse {
    id: number
    name: string
    tasks: TreeTask[]
}

export interface SimpleTaskPatchInput {
    title?: string
    description?: string
    deadline?: string
    priority?: TaskPriority
    parentId?: number | null
}
