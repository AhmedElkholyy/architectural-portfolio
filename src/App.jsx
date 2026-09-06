import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Lenis from 'lenis'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { useColorTokens } from './hooks/useColorTokens'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Layout from './components/Layout'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import HomeEditor from './pages/admin/Content'
import Projects from './pages/admin/Projects'
import ProjectEditor from './pages/admin/ProjectEditor'
import ContactAdmin from './pages/admin/ContactAdmin'

function AppRoutes() {
  useColorTokens()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !isAdmin })
    window.__lenis = lenis
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [isAdmin])

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <>
      {!isAdmin && <CustomCursor />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<HomeEditor />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectEditor />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="contact" element={<ContactAdmin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const onLoaded = useCallback(() => setLoaded(true), [])

  return (
    <LanguageProvider>
      <AuthProvider>
        {!loaded && <LoadingScreen onComplete={onLoaded} />}
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  )
}
