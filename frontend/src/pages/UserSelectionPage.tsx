import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { User } from '../types'
import { getUsers, createUser } from '../api'
import { avatarColor } from '../utils/avatar'
import { useUser } from '../context/UserContext'

export default function UserSelectionPage() {
    const navigate = useNavigate()
    const { selectUser } = useUser()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)

    const load = useCallback(async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const pick = (id: number) => {
        selectUser(id)
        navigate('/')
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error('Name is required.')
            return
        }
        setSaving(true)
        try {
            const user = await createUser({ name: name.trim() })
            toast.success('User created.')
            pick(user.id)
        } catch (err) {
            toast.error((err as Error).message)
            setSaving(false)
        }
    }

    if (loading)
        return (
            <div className="profile-page">
                <div className="spinner-wrap">
                    <div className="spinner" />
                </div>
            </div>
        )

    return (
        <div className="profile-page">
            <h1 className="profile-heading">Who's using Thorns.Todo?</h1>
            <div className="profile-grid">
                {users.map((user) => (
                    <button
                        key={user.id}
                        type="button"
                        className="profile-tile"
                        onClick={() => pick(user.id)}
                    >
                        <div
                            className="profile-avatar"
                            style={{ background: avatarColor(user.id) }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-name">{user.name}</div>
                    </button>
                ))}
                <button
                    type="button"
                    className="profile-tile"
                    onClick={() => setCreating(true)}
                >
                    <div className="profile-avatar profile-avatar-add">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <line x1="11" y1="2" x2="11" y2="20" />
                            <line x1="2" y1="11" x2="20" y2="11" />
                        </svg>
                    </div>
                    <div className="profile-name">Add user</div>
                </button>
            </div>

            {creating && (
                <div className="overlay" onClick={() => setCreating(false)}>
                    <div
                        className="dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="dialog-title">New user</div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="user-name"
                                >
                                    Name
                                </label>
                                <input
                                    id="user-name"
                                    className="form-input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Alex"
                                    autoFocus
                                />
                            </div>
                            <div className="dialog-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setCreating(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Creating…' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
