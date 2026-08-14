import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    type ReactNode,
} from 'react'

const STORAGE_KEY = 'thorns-todo:selected-user'

interface UserContextValue {
    userId: number | undefined
    selectUser: (id: number) => void
    clearUser: () => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<number | undefined>(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? Number(stored) : undefined
    })

    useEffect(() => {
        if (userId === undefined) localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, String(userId))
    }, [userId])

    const value = useMemo(
        () => ({
            userId,
            selectUser: (id: number) => setUserId(id),
            clearUser: () => setUserId(undefined),
        }),
        [userId],
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used within a UserProvider')
    return ctx
}
