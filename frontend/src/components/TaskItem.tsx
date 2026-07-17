import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { SimpleTaskBase } from '../types'
import { finishSimpleTask, deleteSimpleTask } from '../api'
import ThreeDotsMenu from './ThreeDotsMenu'
import ConfirmDialog from './ConfirmDialog'

interface Props {
    task: SimpleTaskBase
    onRefresh: () => void
}

const priorityLabels = {
    critical: 'Critical',
    standard: 'Standard',
    low: 'Low',
}

function formatDeadline(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const overdue = d < now
    const label = d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
    return { label, overdue }
}

export default function TaskItem({ task, onRefresh }: Props) {
    const navigate = useNavigate()
    const [confirm, setConfirm] = useState(false)
    const [finishing, setFinishing] = useState(false)
    const isFinished = !!task.finishedAt

    const handleFinish = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFinished || finishing) return
        setFinishing(true)
        try {
            await finishSimpleTask(task.id)
            toast.success('Task marked as done!')
            onRefresh()
        } catch (err) {
            toast.error((err as Error).message)
            setFinishing(false)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteSimpleTask(task.id)
            toast.success('Task deleted.')
            onRefresh()
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    const deadline = task.deadline ? formatDeadline(task.deadline) : null

    return (
        <>
            <div
                className={`task-item priority-${task.priority}${isFinished ? ' finished' : ''}`}
            >
                <button
                    className={`task-finish-btn${isFinished ? ' done' : ''}`}
                    onClick={handleFinish}
                    disabled={isFinished || finishing}
                    title={isFinished ? 'Done' : 'Mark as done'}
                >
                    {isFinished && (
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="2,6 5,9 10,3" />
                        </svg>
                    )}
                </button>

                <div
                    className="task-body"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                >
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                        <span className={`badge badge-${task.priority}`}>
                            <span className="badge-dot" />
                            {priorityLabels[task.priority]}
                        </span>
                        {deadline && (
                            <span
                                className={`task-deadline${deadline.overdue && !isFinished ? ' overdue' : ''}`}
                            >
                                {deadline.overdue && !isFinished ? '↑ ' : ''}
                                {deadline.label}
                            </span>
                        )}
                    </div>
                </div>

                <ThreeDotsMenu
                    items={[
                        {
                            label: 'Edit',
                            icon: (
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" />
                                </svg>
                            ),
                            onClick: () => navigate(`/tasks/${task.id}/edit`),
                        },
                        {
                            label: 'Delete',
                            danger: true,
                            icon: (
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="2,4 12,4" />
                                    <path d="M5,4V2h4v2M5.5,4v8M8.5,4v8" />
                                    <rect
                                        x="3"
                                        y="4"
                                        width="8"
                                        height="9"
                                        rx="1"
                                    />
                                </svg>
                            ),
                            onClick: () => setConfirm(true),
                        },
                    ]}
                />
            </div>

            {confirm && (
                <ConfirmDialog
                    title="Delete task?"
                    message={`"${task.title}" and all its subtasks will be permanently deleted.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    )
}
