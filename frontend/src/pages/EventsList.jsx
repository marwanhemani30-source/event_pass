import { useEffect, useState } from 'react'

export default function EventsList() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
  }, [])

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map(e => (
          <li key={e.id}>
            {e.name} ({e.status})
          </li>
        ))}
      </ul>
    </div>
  )
}
