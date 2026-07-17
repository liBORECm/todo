import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { RTaskInstance } from '../types'
import { deleteRTaskInstance, finishRTaskInstance } from '../api'
import ThreeDotsMenu from './ThreeDotsMenu'
import ConfirmDialog from './ConfirmDialog'

const PRIORITY_LABEL = {
    critical: 'Critical',
    standard: 'Standard',
    low: 'Low',
}

function formatDeadline(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    return {
        label: d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        }),
        overdue: d < now,
    }
}

interface Props {
    task: RTaskInstance
    onRefresh: () => void
}

export default function RTaskItem({ task, onRefresh }: Props) {
    const navigate = useNavigate()
    const [confirm, setConfirm] = useState(false)
    const [finishing, setFinishing] = useState(false)
    const isFinished = !!task.finishedAt

    const handleFinish = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFinished || finishing) return
        setFinishing(true)
        try {
            await finishRTaskInstance(task.id)
            toast.success('Task marked as done!')
            onRefresh()
        } catch (err) {
            toast.error((err as Error).message)
            setFinishing(false)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteRTaskInstance(task.id)
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
                    onClick={() => navigate(`/r-tasks/${task.id}`)}
                >
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                        <span className={`badge badge-${task.priority}`}>
                            <span className="badge-dot" />
                            {PRIORITY_LABEL[task.priority]}
                        </span>
                        <span
                            className="badge badge-duration"
                            style={{ gap: '4px' }}
                        >
                            <svg
                                width="9"
                                height="9"
                                viewBox="0 0 10 10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            >
                                <path d="M2,2 L2,5 L8,5" />
                                <path d="M2,8 L8,8" />
                                <path d="M8,2 L8,8" />
                            </svg>
                            Recurring
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
                            label: 'View',
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
                                    <circle cx="7" cy="7" r="2.5" />
                                    <path d="M1,7 C2.5,3.5 5,2 7,2 C9,2 11.5,3.5 13,7 C11.5,10.5 9,12 7,12 C5,12 2.5,10.5 1,7z" />
                                </svg>
                            ),
                            onClick: () => navigate(`/r-tasks/${task.id}`),
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
                    title="Delete recurring task?"
                    message={`"${task.title}" will be permanently deleted.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    )
}
