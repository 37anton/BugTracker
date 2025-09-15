import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import Dashboard from './components/pages/Dashboard'
import TicketDetail from './components/pages/TicketDetail'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/toast/ToastProvider'
import { AuthProvider } from './contexts/AuthContext'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { 
    path: '/dashboard', 
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/tickets/:id', 
    element: (
      <ProtectedRoute>
        <TicketDetail />
      </ProtectedRoute>
    ) 
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
