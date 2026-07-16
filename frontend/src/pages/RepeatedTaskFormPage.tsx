import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import cronstrue from 'cronstrue'
import type { TaskPriority } from '../types'
import { getRepeatedTask, createRepeatedTask, updateRepeatedTask } from '../api'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildCron(
    dom: string,
    month: string,
    selectedDays: Set<number>,
): string {
    const dow =
        selectedDays.size === 0 ? '*' : [...selectedDays].sort().join(',')
    return `0 0 ${dom || '*'} ${month || '*'} ${dow}`
}

function parseCron(cron: string): {
    dom: string
    month: string
    selectedDays: Set<number>
} {
    const parts = cron.trim().split(/\s+/)
    if (parts.length < 5)
        return { dom: '*', month: '*', selectedDays: new Set() }
    const [, , dom, month, dow] = parts
    const selectedDays = new Set<number>()
    if (dow !== '*') {
        for (const d of dow.split(',')) {
            const n = parseInt(d, 10)
            if (!isNaN(n)) selectedDays.add(n)
        }
    }
    return { dom, month, selectedDays }
}

function cronPreview(cron: string): string {
    try {
        return cronstrue.toString(cron)
    } catch {
        return 'Invalid expression'
    }
}

export default function RepeatedTaskFormPage() {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const isEdit = !!id
    const navigate = useNavigate()

    const tableIdParam = Number(searchParams.get('tableId'))

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('standard')
    const [duration, setDuration] = useState('1')
    const [dom, setDom] = useState('*')
    const [month, setMonth] = useState('*')
    const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())
    const [tableId, setTableId] = useState(tableIdParam)
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!isEdit) return
        getRepeatedTask(Number(id))
            .then((t) => {
                setTitle(t.title)
                setDescription(t.description ?? '')
                setPriority(t.priority)
                setDuration(String(t.duration))
                setTableId(t.tableId)
                const parsed = parseCron(t.cron)
                setDom(parsed.dom)
                setMonth(parsed.month)
                setSelectedDays(parsed.selectedDays)
            })
            .catch((err) => {
                toast.error((err as Error).message)
                navigate(-1)
            })
            .finally(() => setLoading(false))
    }, [id, isEdit, navigate])

    const toggleDay = (idx: number) => {
        setSelectedDays((prev) => {
            const next = new Set(prev)
            next.has(idx) ? next.delete(idx) : next.add(idx)
            return next
        })
    }

    const cron = buildCron(dom, month, selectedDays)
    const preview = cronPreview(cron)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            toast.error('Title is required.')
            return
        }
        const dur = parseInt(duration, 10)
        if (!dur || dur < 1) {
            toast.error('Duration must be at least 1 day.')
            return
        }

        setSaving(true)
        try {
            if (isEdit) {
                await updateRepeatedTask(Number(id), {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    cron,
                    duration: dur,
                })
                toast.success('Repeated task updated.')
                navigate(`/todo-table/${tableId}?tab=repeated`)
            } else {
                await createRepeatedTask({
                    tableId,
                    title: title.trim(),
                    description: description.trim() || undefined,
                    priority,
                    cron,
                    duration: dur,
                })
                toast.success('Repeated task created.')
                navigate(`/todo-table/${tableId}?tab=repeated`)
            }
        } catch (err) {
            toast.error((err as Error).message)
            setSaving(false)
        }
    }

    const BackArrow = () => (
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
    )

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
                    <BackArrow /> Back
                </button>
                <h1 className="page-title">
                    {isEdit ? 'Edit Repeated Task' : 'New Repeated Task'}
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
                            placeholder="What repeats?"
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
                            <label className="form-label" htmlFor="duration">
                                Duration (days)
                            </label>
                            <input
                                id="duration"
                                className="form-input"
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Schedule</label>

                        <div className="cron-editor">
                            <div className="cron-section">
                                <span className="cron-section-label">
                                    Days of week
                                </span>
                                <div className="cron-day-pills">
                                    {DAYS.map((d, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`cron-day-pill${selectedDays.has(i) ? ' active' : ''}`}
                                            onClick={() => toggleDay(i)}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                }}
                            >
                                <div className="cron-section">
                                    <span className="cron-section-label">
                                        Day of month
                                    </span>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={dom}
                                        onChange={(e) => setDom(e.target.value)}
                                        placeholder="* or 1–31"
                                    />
                                </div>
                                <div className="cron-section">
                                    <span className="cron-section-label">
                                        Month
                                    </span>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={month}
                                        onChange={(e) =>
                                            setMonth(e.target.value)
                                        }
                                        placeholder="* or 1–12"
                                    />
                                </div>
                            </div>

                            <div className="cron-preview">
                                <span className="cron-preview-label">
                                    Runs:
                                </span>
                                <span className="cron-preview-text">
                                    {preview}
                                </span>
                            </div>
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
                                  : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
