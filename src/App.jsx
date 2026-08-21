import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { CrmProvider } from './lib/CrmContext'
import AppShell from './layouts/AppShell'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import DashboardPage from './pages/crm/DashboardPage'
import ContactsPage from './pages/crm/ContactsPage'
import CompaniesPage from './pages/crm/CompaniesPage'
import PipelinePage from './pages/crm/PipelinePage'
import TasksPage from './pages/crm/TasksPage'
import ReportsPage from './pages/crm/ReportsPage'
import SettingsPage from './pages/crm/SettingsPage'
import './crm.css'

function AppRoutes() {
  const { session } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={session ? '/dashboard' : '/signin'} replace />} />
      <Route
        path="/signin"
        element={session ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={session ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />
      <Route
        element={
          session ? (
            <CrmProvider>
              <AppShell />
            </CrmProvider>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
