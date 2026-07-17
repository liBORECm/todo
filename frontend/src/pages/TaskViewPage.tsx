import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { SimpleTask } from '../types'
import { getSimpleTask } from '../api'
import TaskItem from '../components/TaskItem'
import SortBar, { type SortField, type SortDir } from '../components/SortBar'
import { sortTasks } from '../utils/sort'

const priorityLabels = {
    critical: 'Critical',
    standard: 'Standard',
    low: 'Low',
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default function TaskViewPage() {
    const { id } = useParams<{ id: string }>()
    const taskId = Number(id)
    const navigate = useNavigate()
    const [task, setTask] = useState<SimpleTask | null>(null)
    const [loading, setLoading] = useState(true)
    const [showFinished, setShowFinished] = useState(false)
    const [sortField, setSortField] = useState<SortField>('createdAt')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    const load = useCallback(async () => {
        try {
            setTask(await getSimpleTask(taskId))
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setLoading(false)
        }
    }, [taskId])

    useEffect(() => {
        load()
    }, [load])

    const goBack = () => {
        if (task?.parentId) navigate(`/tasks/${task.parentId}`)
        else navigate(`/todo-table/${task?.tableId}`)
    }

    if (loading)
        return (
            <div className="page">
                <div className="spinner-wrap">
                    <div className="spinner" />
                </div>
            </div>
        )
    if (!task) return null

    const isFinished = !!task.finishedAt
    const filteredSubtasks = showFinished
        ? task.subtasks
        : task.subtasks.filter((t) => !t.finishedAt)
    const visibleSubtasks = sortTasks(filteredSubtasks, sortField, sortDir)

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={goBack}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="10,3 5,8 10,13" />
                    </svg>
                    Back
                </button>
                <h1 className="page-title" style={{ fontSize: '18px' }}>
                    Task
                </h1>
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(
                            `/tasks/create?tableId=${task.tableId}&parentId=${task.id}`,
                        )
                    }
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <line x1="6" y1="1" x2="6" y2="11" />
                        <line x1="1" y1="6" x2="11" y2="6" />
                    </svg>
                    Add subtask
                </button>
            </div>

            <div className="task-detail-card">
                <div
                    className="task-detail-title"
                    style={
                        isFinished
                            ? {
                                  textDecoration: 'line-through',
                                  color: 'var(--faint)',
                              }
                            : undefined
                    }
                >
                    {task.title}
                </div>

                <div className="task-detail-meta">
                    <span className={`badge badge-${task.priority}`}>
                        <span className="badge-dot" />
                        {priorityLabels[task.priority]}
                    </span>
                    {isFinished && (
                        <span
                            className="badge"
                            style={{
                                background: 'rgba(22,163,74,.08)',
                                borderColor: 'rgba(22,163,74,.2)',
                                color: 'var(--success)',
                            }}
                        >
                            <span className="badge-dot" />
                            Done
                        </span>
                    )}
                    {task.deadline && (
                        <span
                            className="task-deadline"
                            style={{ fontSize: '12px' }}
                        >
                            Due {formatDate(task.deadline)}
                        </span>
                    )}
                    {task.finishedAt && (
                        <span
                            className="task-deadline"
                            style={{ fontSize: '12px' }}
                        >
                            Finished {formatDate(task.finishedAt)}
                        </span>
                    )}
                </div>

                {task.description && (
                    <div className="task-detail-description">
                        {task.description}
                    </div>
                )}

                <div style={{ marginTop: '16px' }}>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/tasks/${task.id}/edit`)}
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" />
                        </svg>
                        Edit
                    </button>
                </div>
            </div>

            <div className="section-label">Subtasks</div>

            <div className="controls-row">
                <button
                    className={`toggle-chip${showFinished ? ' active' : ''}`}
                    onClick={() => setShowFinished((s) => !s)}
                >
                    {showFinished && (
                        <svg
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="1.5,5.5 4,8.5 9.5,2.5" />
                        </svg>
                    )}
                    Finished
                </button>
                <SortBar
                    field={sortField}
                    dir={sortDir}
                    onField={setSortField}
                    onDir={() =>
                        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
                    }
                />
            </div>

            {visibleSubtasks.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 20px' }}>
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-title">
                        {task.subtasks.length > 0 && !showFinished
                            ? 'All subtasks done!'
                            : 'No subtasks'}
                    </div>
                    <p>
                        {task.subtasks.length > 0 && !showFinished
                            ? 'Toggle to see finished subtasks.'
                            : 'Break this task into smaller pieces.'}
                    </p>
                </div>
            ) : (
                <div className="task-list-card">
                    {visibleSubtasks.map((sub) => (
                        <TaskItem key={sub.id} task={sub} onRefresh={load} />
                    ))}
                </div>
            )}
        </div>
    )
}
