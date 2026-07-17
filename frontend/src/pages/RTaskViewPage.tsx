import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { RTaskInstance } from '../types'
import {
    getRTaskInstance,
    finishRTaskInstance,
    deleteRTaskInstance,
} from '../api'
import ConfirmDialog from '../components/ConfirmDialog'

const PRIORITY_LABEL = {
    critical: 'Critical',
    standard: 'Standard',
    low: 'Low',
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function RTaskViewPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [task, setTask] = useState<RTaskInstance | null>(null)
    const [loading, setLoading] = useState(true)
    const [confirm, setConfirm] = useState(false)
    const [finishing, setFinishing] = useState(false)

    useEffect(() => {
        getRTaskInstance(Number(id))
            .then(setTask)
            .catch((err) => {
                toast.error((err as Error).message)
                navigate(-1)
            })
            .finally(() => setLoading(false))
    }, [id, navigate])

    const handleFinish = async () => {
        if (!task || task.finishedAt || finishing) return
        setFinishing(true)
        try {
            await finishRTaskInstance(task.id)
            toast.success('Task marked as done!')
            setTask((t) =>
                t ? { ...t, finishedAt: new Date().toISOString() } : t,
            )
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setFinishing(false)
        }
    }

    const handleDelete = async () => {
        if (!task) return
        try {
            await deleteRTaskInstance(task.id)
            toast.success('Task deleted.')
            navigate(`/todo-table/${task.tableId}`)
        } catch (err) {
            toast.error((err as Error).message)
        }
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
    const deadline = task.deadline ? new Date(task.deadline) : null
    const overdue = deadline && deadline < new Date() && !isFinished

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
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
                <h1
                    className="page-title"
                    style={
                        isFinished
                            ? { textDecoration: 'line-through', opacity: 0.6 }
                            : {}
                    }
                >
                    {task.title}
                </h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {!isFinished && (
                        <button
                            className="btn btn-ghost"
                            onClick={handleFinish}
                            disabled={finishing}
                        >
                            {finishing ? 'Saving…' : 'Mark done'}
                        </button>
                    )}
                    <button
                        className="btn btn-danger"
                        onClick={() => setConfirm(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="form-card" style={{ padding: '24px' }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <span className={`badge badge-${task.priority}`}>
                        <span className="badge-dot" />
                        {PRIORITY_LABEL[task.priority]}
                    </span>
                    <span className="badge badge-duration">
                        <svg
                            width="10"
                            height="10"
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
                    {isFinished && (
                        <span
                            className="badge"
                            style={{
                                background: 'rgba(22,163,74,.1)',
                                borderColor: 'rgba(22,163,74,.25)',
                                color: '#16a34a',
                            }}
                        >
                            ✓ Finished
                        </span>
                    )}
                </div>

                {task.description && (
                    <p
                        style={{
                            color: 'var(--ink)',
                            lineHeight: 1.65,
                            marginBottom: '20px',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {task.description}
                    </p>
                )}

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        fontSize: '13px',
                        color: 'var(--muted)',
                    }}
                >
                    {deadline && (
                        <div
                            style={{
                                color: overdue
                                    ? 'var(--p-crit)'
                                    : 'var(--muted)',
                                fontWeight: overdue ? 600 : 400,
                            }}
                        >
                            <strong>Deadline:</strong>{' '}
                            {formatDate(task.deadline!)}
                            {overdue && ' — Overdue'}
                        </div>
                    )}
                    {isFinished && (
                        <div>
                            <strong>Finished:</strong>{' '}
                            {formatDate(task.finishedAt!)}
                        </div>
                    )}
                    <div>
                        <strong>Created:</strong> {formatDate(task.createdAt)}
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmDialog
                    title="Delete recurring task?"
                    message={`"${task.title}" will be permanently deleted.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </div>
    )
}
