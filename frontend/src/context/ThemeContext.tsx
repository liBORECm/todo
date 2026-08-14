import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    type ReactNode,
} from 'react'
import { THEMES, DEFAULT_THEME, type ThemeId } from '../themes'

const STORAGE_KEY = 'thorns-todo:theme'

interface ThemeContextValue {
    theme: ThemeId
    setTheme: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemeId(value: string | null): value is ThemeId {
    return THEMES.some((t) => t.id === value)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeId>(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        return isThemeId(stored) ? stored : DEFAULT_THEME
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const value = useMemo(() => ({ theme, setTheme }), [theme])

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
    return ctx
}
