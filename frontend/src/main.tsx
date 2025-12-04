import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from '@/contexts/auth.context' 
import { PrivateRoute } from './components/private-route'

import { MainLayout } from './layouts/main-layout'
import { DashboardPage } from './pages/dashboard'
import { ProfilePage } from './pages/profile'
import { ExplorePage } from './pages/explore'
import { LoginPage } from './pages/login'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "explore",
        element: (
          <PrivateRoute>
            <ExplorePage />
          </PrivateRoute>
        ),
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)