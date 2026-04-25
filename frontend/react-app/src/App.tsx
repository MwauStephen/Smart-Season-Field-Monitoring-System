import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DashboardLayout } from '@/components/DashboardLayout'

import LoginPage from '@/pages/Login'
import DashboardPage from '@/pages/Dashboard'
import FieldsPage from '@/pages/Fields'
import UsersPage from '@/pages/Users'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/fields" element={<FieldsPage />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/users" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
