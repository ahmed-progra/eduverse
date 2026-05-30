import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PathsPage from './pages/PathsPage'
import PathDetailPage from './pages/PathDetailPage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const location = useLocation()
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/paths" element={<ProtectedRoute><PathsPage /></ProtectedRoute>} />
        <Route path="/paths/:pathSlug" element={<ProtectedRoute><PathDetailPage /></ProtectedRoute>} />
        <Route path="/courses/:courseSlug" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/lessons/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/exams/:examId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/results/:attemptId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#181c24',
            color: '#f1f5f9',
            border: '1px solid #1f2535',
          },
        }}
      />
    </BrowserRouter>
  )
}
