import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { THEMES } from '../themes'
import { useTheme } from '../context/ThemeContext'

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
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

    const current = THEMES.find((t) => t.id === theme) ?? THEMES[0]

    const handleTrigger = () => {
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
                type="button"
                className="btn btn-ghost btn-sm theme-switcher-trigger"
                onClick={handleTrigger}
                aria-label="Choose theme"
            >
                <span
                    className="theme-swatch"
                    style={{
                        background: `linear-gradient(135deg, ${current.swatch} 50%, ${current.swatchAlt} 50%)`,
                    }}
                />
                {current.label}
            </button>

            {open &&
                ReactDOM.createPortal(
                    <div
                        ref={dropdownRef}
                        className="menu-dropdown theme-switcher-dropdown"
                        style={{
                            position: 'fixed',
                            top: pos.top,
                            right: pos.right,
                            left: 'auto',
                        }}
                    >
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                className={`menu-item theme-switcher-item${t.id === theme ? ' selected' : ''}`}
                                onClick={() => {
                                    setTheme(t.id)
                                    setOpen(false)
                                }}
                            >
                                <span
                                    className="theme-swatch"
                                    style={{
                                        background: `linear-gradient(135deg, ${t.swatch} 50%, ${t.swatchAlt} 50%)`,
                                    }}
                                />
                                {t.label}
                                {t.id === theme && (
                                    <svg
                                        className="theme-switcher-check"
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
                        ))}
                    </div>,
                    document.body,
                )}
        </div>
    )
}
