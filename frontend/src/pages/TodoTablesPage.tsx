import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { TodoTable } from '../types'
import { getTodoTables, deleteTodoTable } from '../api'
import ThreeDotsMenu from '../components/ThreeDotsMenu'
import ConfirmDialog from '../components/ConfirmDialog'

const AVATAR_COLORS = [
    '#1b1d40',
    '#7c3aed',
    '#0369a1',
    '#b45309',
    '#0f766e',
    '#9d174d',
    '#4338ca',
    '#047857',
]

function avatarColor(id: number) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

export default function TodoTablesPage() {
    const navigate = useNavigate()
    const [tables, setTables] = useState<TodoTable[]>([])
    const [loading, setLoading] = useState(true)
    const [confirmId, setConfirmId] = useState<number | null>(null)

    const load = useCallback(async () => {
        try {
            const data = await getTodoTables()
            setTables(data)
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const handleDelete = async () => {
        if (confirmId == null) return
        try {
            await deleteTodoTable(confirmId)
            toast.success('Table deleted.')
            setConfirmId(null)
            load()
        } catch (err) {
            toast.error((err as Error).message)
            setConfirmId(null)
        }
    }

    const confirmTable = tables.find((t) => t.id === confirmId)

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Tables</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/todo-table/create')}
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
                    New table
                </button>
            </div>

            {loading ? (
                <div className="spinner-wrap">
                    <div className="spinner" />
                </div>
            ) : tables.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-title">No tables yet</div>
                    <p>Create your first table to get started.</p>
                </div>
            ) : (
                <div className="table-grid">
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className="table-card"
                            onClick={() => navigate(`/todo-table/${table.id}`)}
                        >
                            <div
                                className="table-avatar"
                                style={{ background: avatarColor(table.id) }}
                            >
                                {table.name.charAt(0)}
                            </div>
                            <div className="table-card-info">
                                <div className="table-card-name">
                                    {table.name}
                                </div>
                                <div className="table-card-meta">
                                    Created{' '}
                                    {new Date(
                                        table.createdAt,
                                    ).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                            <ThreeDotsMenu
                                items={[
                                    {
                                        label: 'Edit',
                                        icon: (
                                            <svg
                                                width="13"
                                                height="13"
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
                                            navigate(
                                                `/todo-table/${table.id}/edit`,
                                            ),
                                    },
                                    {
                                        label: 'Delete',
                                        danger: true,
                                        icon: (
                                            <svg
                                                width="13"
                                                height="13"
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
                                        onClick: () => setConfirmId(table.id),
                                    },
                                ]}
                            />
                        </div>
                    ))}
                </div>
            )}

            {confirmTable && (
                <ConfirmDialog
                    title="Delete table?"
                    message={`"${confirmTable.name}" and all its tasks will be permanently deleted.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmId(null)}
                />
            )}
        </div>
    )
}
