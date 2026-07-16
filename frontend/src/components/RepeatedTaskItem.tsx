import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import cronstrue from 'cronstrue'
import type { RepeatedTask } from '../types'
import { deleteRepeatedTask } from '../api'
import ThreeDotsMenu from './ThreeDotsMenu'
import ConfirmDialog from './ConfirmDialog'

const PRIORITY_LABEL = {
    critical: 'Critical',
    standard: 'Standard',
    low: 'Low',
}

function readableCron(cron: string): string {
    try {
        return cronstrue.toString(cron)
    } catch {
        return cron
    }
}

interface Props {
    task: RepeatedTask
    onRefresh: () => void
}

export default function RepeatedTaskItem({ task, onRefresh }: Props) {
    const navigate = useNavigate()
    const [confirm, setConfirm] = useState(false)

    const handleDelete = async () => {
        try {
            await deleteRepeatedTask(task.id)
            toast.success('Repeated task deleted.')
            onRefresh()
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    return (
        <>
            <div className={`task-item priority-${task.priority}`}>
                <div className="task-body" style={{ cursor: 'default' }}>
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                        <span className={`badge badge-${task.priority}`}>
                            <span className="badge-dot" />
                            {PRIORITY_LABEL[task.priority]}
                        </span>
                        <span className="task-deadline">
                            {readableCron(task.cron)}
                        </span>
                        <span className="task-deadline">{task.duration}d</span>
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
                            onClick: () =>
                                navigate(`/repeated-task/${task.id}/edit`),
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
                    title="Delete repeated task?"
                    message={`"${task.title}" will be permanently deleted.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    )
}
