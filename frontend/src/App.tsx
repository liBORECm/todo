import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import TodoTablesPage from './pages/TodoTablesPage'
import TodoTableFormPage from './pages/TodoTableFormPage'
import TasksPage from './pages/TasksPage'
import TaskViewPage from './pages/TaskViewPage'
import TaskFormPage from './pages/TaskFormPage'
import RepeatedTaskFormPage from './pages/RepeatedTaskFormPage'
import RTaskViewPage from './pages/RTaskViewPage'

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Thorns<span className="dot">.</span>Todo
            </Link>
        </nav>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Navbar />
                <Routes>
                    <Route path="/" element={<TodoTablesPage />} />
                    <Route
                        path="/todo-table/create"
                        element={<TodoTableFormPage />}
                    />
                    <Route
                        path="/todo-table/:id/edit"
                        element={<TodoTableFormPage />}
                    />
                    <Route path="/todo-table/:id" element={<TasksPage />} />
                    <Route path="/tasks/create" element={<TaskFormPage />} />
                    <Route path="/tasks/:id" element={<TaskViewPage />} />
                    <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
                    <Route
                        path="/repeated-task/create"
                        element={<RepeatedTaskFormPage />}
                    />
                    <Route
                        path="/repeated-task/:id/edit"
                        element={<RepeatedTaskFormPage />}
                    />
                    <Route path="/r-tasks/:id" element={<RTaskViewPage />} />
                </Routes>
            </div>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        borderRadius: '9px',
                        background: '#1b1d40',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        border: '1px solid rgba(255,255,255,.1)',
                        boxShadow: '0 8px 24px rgba(27,29,64,.2)',
                    },
                    success: {
                        iconTheme: { primary: '#16a34a', secondary: '#fff' },
                    },
                    error: {
                        iconTheme: { primary: '#ee1f53', secondary: '#fff' },
                    },
                }}
            />
        </BrowserRouter>
    )
}
