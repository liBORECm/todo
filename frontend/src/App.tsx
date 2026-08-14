import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import TodoTablesPage from './pages/TodoTablesPage'
import TodoTableFormPage from './pages/TodoTableFormPage'
import TasksPage from './pages/TasksPage'
import TaskViewPage from './pages/TaskViewPage'
import TaskFormPage from './pages/TaskFormPage'
import RepeatedTaskFormPage from './pages/RepeatedTaskFormPage'
import RTaskViewPage from './pages/RTaskViewPage'
import UserSelectionPage from './pages/UserSelectionPage'
import { UserProvider, useUser } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSwitcher from './components/ThemeSwitcher'

function RequireUser({ children }: { children: ReactNode }) {
    const { userId } = useUser()
    if (userId === undefined) return <Navigate to="/select-user" replace />
    return <>{children}</>
}

function Navbar() {
    const { clearUser } = useUser()
    const navigate = useNavigate()
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Thorns<span className="dot">.</span>Todo
            </Link>
            <div className="navbar-actions">
                <ThemeSwitcher />
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                        clearUser()
                        navigate('/select-user')
                    }}
                >
                    Switch user
                </button>
            </div>
        </nav>
    )
}

function AppShell() {
    const location = useLocation()
    const isSelectUser = location.pathname === '/select-user'

    return (
        <div className="app-layout">
            {!isSelectUser && <Navbar />}
            <Routes>
                <Route path="/select-user" element={<UserSelectionPage />} />
                <Route
                    path="/"
                    element={
                        <RequireUser>
                            <TodoTablesPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/todo-table/create"
                    element={
                        <RequireUser>
                            <TodoTableFormPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/todo-table/:id/edit"
                    element={
                        <RequireUser>
                            <TodoTableFormPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/todo-table/:id"
                    element={
                        <RequireUser>
                            <TasksPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/tasks/create"
                    element={
                        <RequireUser>
                            <TaskFormPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/tasks/:id"
                    element={
                        <RequireUser>
                            <TaskViewPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/tasks/:id/edit"
                    element={
                        <RequireUser>
                            <TaskFormPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/repeated-task/create"
                    element={
                        <RequireUser>
                            <RepeatedTaskFormPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/repeated-task/:id/edit"
                    element={
                        <RequireUser>
                            <RepeatedTaskFormPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/r-tasks/:id"
                    element={
                        <RequireUser>
                            <RTaskViewPage />
                        </RequireUser>
                    }
                />
            </Routes>
        </div>
    )
}

export default function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <BrowserRouter>
                    <AppShell />
                </BrowserRouter>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            borderRadius: '9px',
                            background: 'var(--navy)',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: '1px solid rgba(255,255,255,.1)',
                            boxShadow: '0 8px 24px rgba(27,29,64,.2)',
                        },
                        success: {
                            iconTheme: {
                                primary: 'var(--success)',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: 'var(--pink)',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </UserProvider>
        </ThemeProvider>
    )
}
