import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

interface MenuItem {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    danger?: boolean
}

interface Props {
    items: MenuItem[]
}

export default function ThreeDotsMenu({ items }: Props) {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({ top: 0, right: 0 })
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

    const handleTrigger = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setPos({
                top: rect.bottom + 4,
                right: window.innerWidth - rect.right,
            })
        }
        setOpen((o) => !o)
    }

    return (
        <div className="menu-wrapper">
            <button
                ref={triggerRef}
                className="menu-trigger"
                onClick={handleTrigger}
                aria-label="Options"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                </svg>
            </button>

            {open &&
                ReactDOM.createPortal(
                    <div
                        ref={dropdownRef}
                        className="menu-dropdown"
                        style={{
                            position: 'fixed',
                            top: pos.top,
                            right: pos.right,
                            left: 'auto',
                        }}
                    >
                        {items.map((item, i) => (
                            <button
                                key={i}
                                className={`menu-item${item.danger ? ' danger' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOpen(false)
                                    item.onClick()
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </div>
    )
}
