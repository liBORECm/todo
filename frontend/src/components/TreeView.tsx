import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { TreeTask, TaskPriority } from '../types'
import { finishSimpleTask } from '../api'

interface TreeNode extends TreeTask {
    children: TreeNode[]
}

function buildTree(flat: TreeTask[]): TreeNode[] {
    const map = new Map<number, TreeNode>()
    for (const t of flat) map.set(t.id, { ...t, children: [] })
    const roots: TreeNode[] = []
    for (const node of map.values()) {
        if (node.parentId === null) {
            roots.push(node)
        } else {
            map.get(node.parentId)?.children.push(node)
        }
    }
    return roots
}

function fmtDeadline(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const label = d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
    return { label, overdue: d < now }
}

const PRIORITY_COLOR: Record<TaskPriority, string> = {
    critical: 'var(--p-crit)',
    standard: 'var(--p-std)',
    low: 'var(--p-low)',
}

function Node({
    node,
    showFinished,
    depth,
    onRefresh,
}: {
    node: TreeNode
    showFinished: boolean
    depth: number
    onRefresh: () => void
}) {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [finishing, setFinishing] = useState(false)

    if (!showFinished && node.finishedAt) return null

    const handleFinish = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (node.finishedAt || finishing) return
        setFinishing(true)
        try {
            await finishSimpleTask(node.id)
            toast.success('Task marked as done!')
            onRefresh()
        } catch (err) {
            toast.error((err as Error).message)
            setFinishing(false)
        }
    }

    const visibleChildren = node.children.filter(
        (c) => showFinished || !c.finishedAt,
    )
    const deadline = node.deadline ? fmtDeadline(node.deadline) : null
    const isFinished = !!node.finishedAt

    return (
        <div>
            <div
                className={`tree-row${isFinished ? ' finished' : ''}`}
                style={{ paddingLeft: `${16 + depth * 24}px` }}
            >
                <span
                    className="tree-priority-bar"
                    style={{ background: PRIORITY_COLOR[node.priority] }}
                />

                <button
                    className="tree-collapse-btn"
                    onClick={() => setCollapsed((c) => !c)}
                    style={{
                        visibility:
                            visibleChildren.length > 0 ? 'visible' : 'hidden',
                    }}
                >
                    <svg
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="currentColor"
                    >
                        {collapsed ? (
                            <polygon points="2,1 8,4.5 2,8" />
                        ) : (
                            <polygon points="1,2 8,2 4.5,8" />
                        )}
                    </svg>
                </button>

                <span
                    className="tree-title"
                    onClick={() => navigate(`/tasks/${node.id}`)}
                >
                    {node.title}
                </span>

                {deadline && (
                    <span
                        className={`tree-deadline${deadline.overdue && !isFinished ? ' overdue' : ''}`}
                    >
                        {deadline.label}
                    </span>
                )}

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
            </div>

            {!collapsed && visibleChildren.length > 0 && (
                <div
                    className="tree-children"
                    style={{ marginLeft: `${28 + depth * 24}px` }}
                >
                    {node.children.map((child) => (
                        <Node
                            key={child.id}
                            node={child}
                            showFinished={showFinished}
                            depth={depth + 1}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface Props {
    tasks: TreeTask[]
    showFinished: boolean
    onRefresh: () => void
}

export default function TreeView({ tasks, showFinished, onRefresh }: Props) {
    const roots = buildTree(tasks)
    const visible = roots.filter((r) => showFinished || !r.finishedAt)

    if (visible.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🌿</div>
                <div className="empty-state-title">
                    {tasks.length > 0 ? 'All caught up!' : 'No tasks yet'}
                </div>
                <p>
                    {tasks.length > 0
                        ? 'Toggle "Finished" to see completed tasks.'
                        : 'Add a task to see the tree.'}
                </p>
            </div>
        )
    }

    return (
        <div className="tree-view">
            {visible.map((root) => (
                <Node
                    key={root.id}
                    node={root}
                    showFinished={showFinished}
                    depth={0}
                    onRefresh={onRefresh}
                />
            ))}
        </div>
    )
}
