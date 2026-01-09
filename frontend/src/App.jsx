import { Routes, Route, Link } from 'react-router-dom'
import EventsList from './pages/EventsList'
import CreateEvent from './pages/CreateEvent'

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>🎫 PassEvent</h1>

      <nav>
        <Link to="/">Events</Link> |{' '}
        <Link to="/create">Create Event</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/create" element={<CreateEvent />} />
      </Routes>
    </div>
  )
}
