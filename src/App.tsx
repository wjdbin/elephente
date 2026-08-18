import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminPage } from './pages/AdminPage'
import { CalendarPage } from './pages/CalendarPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { HomePage } from './pages/HomePage'
import { TournamentsPage } from './pages/TournamentsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/edit" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
