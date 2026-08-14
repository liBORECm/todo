import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { User } from '../types'
import {
    getTodoTable,
    createTodoTable,
    updateTodoTable,
    getUsers,
    getUserTodoTables,
    setUserTodoTables,
} from '../api'
import { avatarColor } from '../utils/avatar'

export default function TodoTableFormPage() {
    const { id } = useParams<{ id: string }>()
    const isEdit = !!id
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [connectedUsers, setConnectedUsers] = useState<User[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [connectOpen, setConnectOpen] = useState(false)
    const [connectingId, setConnectingId] = useState<number | null>(null)
    const connectWrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!connectOpen) return
        const handler = (e: MouseEvent) => {
            if (!connectWrapperRef.current?.contains(e.target as Node)) {
                setConnectOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [connectOpen])

    const loadTable = useCallback(async () => {
        const t = await getTodoTable(Number(id))
        setName(t.name)
        setConnectedUsers(t.users)
    }, [id])

    useEffect(() => {
        if (!isEdit) return
        Promise.all([loadTable(), getUsers().then(setAllUsers)])
            .catch((err) => {
                toast.error((err as Error).message)
                navigate('/')
            })
            .finally(() => setLoading(false))
    }, [id, isEdit, navigate, loadTable])

    const connectableUsers = allUsers.filter(
        (u) => !connectedUsers.some((c) => c.id === u.id),
    )

    const handleConnect = async (userId: number) => {
        setConnectingId(userId)
        try {
            const existingTables = await getUserTodoTables(userId)
            const tableIds = Array.from(
                new Set([...existingTables.map((t) => t.id), Number(id)]),
            )
            await setUserTodoTables(userId, tableIds)
            await loadTable()
            toast.success('User connected.')
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setConnectingId(null)
        }
    }

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

            {isEdit && (
                <div className="form-card connected-users-card">
                    <div className="connected-users-header">
                        <span className="form-label">Connected users</span>
                        <div
                            className="connect-user-wrapper"
                            ref={connectWrapperRef}
                        >
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => setConnectOpen((o) => !o)}
                            >
                                + Connect user
                            </button>
                            {connectOpen && (
                                <div className="connect-user-dropdown">
                                    {connectableUsers.length === 0 ? (
                                        <div className="connect-user-empty">
                                            All users are already connected.
                                        </div>
                                    ) : (
                                        connectableUsers.map((u) => (
                                            <button
                                                key={u.id}
                                                type="button"
                                                className="connect-user-item"
                                                onClick={() =>
                                                    handleConnect(u.id)
                                                }
                                                disabled={connectingId === u.id}
                                            >
                                                <span
                                                    className="user-chip-avatar"
                                                    style={{
                                                        background: avatarColor(
                                                            u.id,
                                                        ),
                                                    }}
                                                >
                                                    {u.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                                {u.name}
                                                {connectingId === u.id && '…'}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {connectedUsers.length === 0 ? (
                        <p className="connected-users-empty">
                            No users connected yet.
                        </p>
                    ) : (
                        <div className="user-chip-list">
                            {connectedUsers.map((u) => (
                                <div key={u.id} className="user-chip">
                                    <span
                                        className="user-chip-avatar"
                                        style={{
                                            background: avatarColor(u.id),
                                        }}
                                    >
                                        {u.name.charAt(0).toUpperCase()}
                                    </span>
                                    {u.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
