import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import EventsPage from './pages/EventsPage'
import AdminPage from './pages/AdminPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <BrowserRouter>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/"          element={<EventsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin"     element={<AdminPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App