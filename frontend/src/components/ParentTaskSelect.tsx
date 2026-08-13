import { useState, useEffect, useRef, useMemo } from 'react'
import ReactDOM from 'react-dom'
import type { SimpleTaskBase } from '../types'

interface TaskNode extends SimpleTaskBase {
    children: TaskNode[]
}

function buildTree(flat: SimpleTaskBase[]): TaskNode[] {
    const map = new Map<number, TaskNode>()
    for (const t of flat) map.set(t.id, { ...t, children: [] })
    const roots: TaskNode[] = []
    for (const node of map.values()) {
        if (node.parentId !== null && map.has(node.parentId)) {
            map.get(node.parentId)!.children.push(node)
        } else {
            roots.push(node)
        }
    }
    return roots
}

interface Props {
    tasks: SimpleTaskBase[]
    value: number | null
    onChange: (id: number | null) => void
    excludeId?: number
    disabled?: boolean
}

export default function ParentTaskSelect({
    tasks,
    value,
    onChange,
    excludeId,
    disabled,
}: Props) {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
    const triggerRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (
                !triggerRef.current?.contains(e.target as Node) &&
                !dropdownRef.current?.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    // A task can't become its own parent, nor a descendant of itself.
    // Finished tasks aren't offered as parents.
    const selectableTasks = useMemo(() => {
        const open = tasks.filter((t) => !t.finishedAt)
        if (excludeId == null) return open
        const excluded = new Set<number>([excludeId])
        let changed = true
        while (changed) {
            changed = false
            for (const t of tasks) {
                if (
                    t.parentId != null &&
                    excluded.has(t.parentId) &&
                    !excluded.has(t.id)
                ) {
                    excluded.add(t.id)
                    changed = true
                }
            }
        }
        return open.filter((t) => !excluded.has(t.id))
    }, [tasks, excludeId])

    const tree = useMemo(() => buildTree(selectableTasks), [selectableTasks])
    const selected = selectableTasks.find((t) => t.id === value) ?? null

    const handleTrigger = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (disabled) return
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            })
        }
        setOpen((o) => !o)
    }

    const select = (id: number | null) => {
        onChange(id)
        setOpen(false)
    }

    return (
        <div className="parent-picker-wrapper">
            <button
                type="button"
                ref={triggerRef}
                className="parent-picker-trigger"
                onClick={handleTrigger}
                disabled={disabled}
            >
                <span
                    className={
                        selected
                            ? 'parent-picker-value'
                            : 'parent-picker-placeholder'
                    }
                >
                    {selected ? selected.title : 'No parent (top-level task)'}
                </span>
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                    className="parent-picker-chevron"
                >
                    <polygon points="1,3 9,3 5,8" />
                </svg>
            </button>

            {open &&
                ReactDOM.createPortal(
                    <div
                        ref={dropdownRef}
                        className="parent-picker-dropdown"
                        style={{
                            position: 'fixed',
                            top: pos.top,
                            left: pos.left,
                            minWidth: pos.width,
                        }}
                    >
                        <button
                            type="button"
                            className={`parent-picker-item root${value === null ? ' selected' : ''}`}
                            onClick={() => select(null)}
                        >
                            No parent (top-level task)
                        </button>
                        {tree.length === 0 ? (
                            <div className="parent-picker-empty">
                                No other tasks in this table yet.
                            </div>
                        ) : (
                            tree.map((node) => (
                                <ParentTaskOption
                                    key={node.id}
                                    node={node}
                                    depth={0}
                                    value={value}
                                    onSelect={select}
                                />
                            ))
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    )
}

function ParentTaskOption({
    node,
    depth,
    value,
    onSelect,
}: {
    node: TaskNode
    depth: number
    value: number | null
    onSelect: (id: number) => void
}) {
    const [collapsed, setCollapsed] = useState(false)
    const hasChildren = node.children.length > 0

    return (
        <div>
            <div
                className="parent-picker-row"
                style={{ paddingLeft: `${8 + depth * 20}px` }}
            >
                <button
                    type="button"
                    className="parent-picker-collapse-btn"
                    onClick={(e) => {
                        e.stopPropagation()
                        setCollapsed((c) => !c)
                    }}
                    style={{
                        visibility: hasChildren ? 'visible' : 'hidden',
                    }}
                >
                    <svg
                        width="8"
                        height="8"
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
                <button
                    type="button"
                    className={`parent-picker-item${node.id === value ? ' selected' : ''}`}
                    onClick={() => onSelect(node.id)}
                >
                    {node.title}
                </button>
            </div>

            {!collapsed && hasChildren && (
                <div
                    className="parent-picker-children"
                    style={{ marginLeft: `${16 + depth * 20}px` }}
                >
                    {node.children.map((child) => (
                        <ParentTaskOption
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            value={value}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
