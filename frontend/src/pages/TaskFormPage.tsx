import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { TaskPriority } from '../types'
import { getSimpleTask, createSimpleTask, updateSimpleTask } from '../api'

function toInputDate(iso: string | null | undefined): string {
    if (!iso) return ''
    return iso.slice(0, 16)
}

export default function TaskFormPage() {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const isEdit = !!id
    const navigate = useNavigate()

    const tableIdParam = Number(searchParams.get('tableId'))
    const parentIdParam = searchParams.get('parentId')
        ? Number(searchParams.get('parentId'))
        : null

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('standard')
    const [deadline, setDeadline] = useState('')
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)

    const [resolvedTableId, setResolvedTableId] = useState<number>(tableIdParam)
    const [resolvedParentId, setResolvedParentId] = useState<number | null>(
        parentIdParam,
    )

    useEffect(() => {
        if (!isEdit) return
        getSimpleTask(Number(id))
            .then((t) => {
                setTitle(t.title)
                setDescription(t.description ?? '')
                setPriority(t.priority)
                setDeadline(toInputDate(t.deadline))
                setResolvedTableId(t.tableId)
                setResolvedParentId(t.parentId)
            })
            .catch((err) => {
                toast.error((err as Error).message)
                navigate(-1)
            })
            .finally(() => setLoading(false))
    }, [id, isEdit, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            toast.error('Title is required.')
            return
        }
        setSaving(true)
        try {
            if (isEdit) {
                await updateSimpleTask(Number(id), {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    deadline: deadline
                        ? new Date(deadline).toISOString()
                        : undefined,
                })
                toast.success('Task updated.')
                navigate(`/tasks/${id}`)
            } else {
                const task = await createSimpleTask({
                    tableId: resolvedTableId,
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    deadline: deadline
                        ? new Date(deadline).toISOString()
                        : undefined,
                    parentId: resolvedParentId ?? undefined,
                })
                toast.success('Task created.')
                navigate(
                    resolvedParentId
                        ? `/tasks/${resolvedParentId}`
                        : `/todo-table/${task.tableId}`,
                )
            }
        } catch (err) {
            toast.error((err as Error).message)
            setSaving(false)
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
                <h1 className="page-title">
                    {isEdit
                        ? 'Edit Task'
                        : resolvedParentId
                          ? 'New Subtask'
                          : 'New Task'}
                </h1>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            className="form-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional details…"
                        />
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                        }}
                    >
                        <div className="form-group">
                            <label className="form-label" htmlFor="priority">
                                Priority
                            </label>
                            <select
                                id="priority"
                                className="form-select"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as TaskPriority)
                                }
                            >
                                <option value="critical">Critical</option>
                                <option value="standard">Standard</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="deadline">
                                Deadline
                            </label>
                            <input
                                id="deadline"
                                className="form-input"
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving…'
                                : isEdit
                                  ? 'Save changes'
                                  : 'Create task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
