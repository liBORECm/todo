import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { SimpleTaskBase, TodoTable } from '../types'
import { getTodoTable, getSimpleTasks } from '../api'
import TaskItem from '../components/TaskItem'
import SortBar, { type SortField, type SortDir } from '../components/SortBar'
import { sortTasks } from '../utils/sort'

export default function TasksPage() {
    const { id } = useParams<{ id: string }>()
    const tableId = Number(id)
    const navigate = useNavigate()
    const [table, setTable] = useState<TodoTable | null>(null)
    const [tasks, setTasks] = useState<SimpleTaskBase[]>([])
    const [loading, setLoading] = useState(true)
    const [showFinished, setShowFinished] = useState(false)
    const [sortField, setSortField] = useState<SortField>('createdAt')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    const load = useCallback(async () => {
        try {
            const [tableData, allTasks] = await Promise.all([
                getTodoTable(tableId),
                getSimpleTasks(),
            ])
            setTable(tableData)
            setTasks(
                allTasks.filter(
                    (t) => t.tableId === tableId && t.parentId === null,
                ),
            )
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setLoading(false)
        }
    }, [tableId])

    useEffect(() => {
        load()
    }, [load])

    const filtered = showFinished ? tasks : tasks.filter((t) => !t.finishedAt)
    const visible = sortTasks(filtered, sortField, sortDir)

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
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
                    Tables
                </button>
                <h1 className="page-title">{table?.name ?? '…'}</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/tasks/create?tableId=${tableId}`)}
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
                    New task
                </button>
            </div>

            {loading ? (
                <div className="spinner-wrap">
                    <div className="spinner" />
                </div>
            ) : (
                <>
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
                                setSortDir((d) =>
                                    d === 'asc' ? 'desc' : 'asc',
                                )
                            }
                        />
                    </div>

                    {visible.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">✅</div>
                            <div className="empty-state-title">
                                {showFinished
                                    ? 'No tasks yet'
                                    : 'All caught up!'}
                            </div>
                            <p>
                                {tasks.length > 0 && !showFinished
                                    ? 'All tasks are finished. Toggle to see them.'
                                    : 'Add a task to get started.'}
                            </p>
                        </div>
                    ) : (
                        <div className="task-list-card">
                            {visible.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onRefresh={load}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
