import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getTodoTable, createTodoTable, updateTodoTable } from '../api'

export default function TodoTableFormPage() {
    const { id } = useParams<{ id: string }>()
    const isEdit = !!id
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!isEdit) return
        getTodoTable(Number(id))
            .then((t) => setName(t.name))
            .catch((err) => {
                toast.error((err as Error).message)
                navigate('/')
            })
            .finally(() => setLoading(false))
    }, [id, isEdit, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error('Name is required.')
            return
        }
        setSaving(true)
        try {
            if (isEdit) {
                await updateTodoTable(Number(id), { name: name.trim() })
                toast.success('Table updated.')
            } else {
                await createTodoTable({ name: name.trim() })
                toast.success('Table created.')
            }
            navigate('/')
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
                <h1 className="page-title">
                    {isEdit ? 'Edit Table' : 'New Table'}
                </h1>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Table name
                        </label>
                        <input
                            id="name"
                            className="form-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Work, Personal, Shopping"
                            autoFocus
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate('/')}
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
                                  : 'Create table'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
