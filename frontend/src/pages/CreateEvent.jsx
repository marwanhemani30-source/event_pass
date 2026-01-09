import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateEvent() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })

    navigate('/')
  }

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Event name"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}
