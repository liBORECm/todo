import type {
    TodoTable,
    SimpleTask,
    SimpleTaskInput,
    SimpleTaskPatchInput,
} from './types'

const BASE = '/api/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
            (body as { error?: string }).error ?? `HTTP ${res.status}`,
        )
    }
    const text = await res.text()
    if (!text) return undefined as T
    try {
        return JSON.parse(text)
    } catch {
        return undefined as T
    }
}

export const getTodoTables = () =>
    request<TodoTable[]>('/todo-table?limit=1000')

export const getTodoTable = (id: number) =>
    request<TodoTable>(`/todo-table/${id}`)

export const createTodoTable = (data: { name: string }) =>
    request<TodoTable>('/todo-table', {
        method: 'POST',
        body: JSON.stringify(data),
    })

export const updateTodoTable = (id: number, data: { name?: string }) =>
    request<TodoTable>(`/todo-table/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })

export const deleteTodoTable = (id: number) =>
    request<void>(`/todo-table/${id}`, { method: 'DELETE' })

export const getSimpleTasks = (params?: { limit?: number }) =>
    request<SimpleTask[]>(`/simple-task?limit=${params?.limit ?? 1000}`)

export const getSimpleTask = (id: number) =>
    request<SimpleTask>(`/simple-task/${id}`)

export const createSimpleTask = (data: SimpleTaskInput) =>
    request<SimpleTask>('/simple-task', {
        method: 'POST',
        body: JSON.stringify(data),
    })

export const updateSimpleTask = (id: number, data: SimpleTaskPatchInput) =>
    request<SimpleTask>(`/simple-task/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })

export const deleteSimpleTask = (id: number) =>
    request<void>(`/simple-task/${id}`, { method: 'DELETE' })

export const finishSimpleTask = (id: number) =>
    request<void>(`/simple-task/finish/${id}`, { method: 'POST' })
