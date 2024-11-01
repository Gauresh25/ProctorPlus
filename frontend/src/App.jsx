// src/App.jsx
import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [greetings, setGreetings] = useState([])
  const [newGreeting, setNewGreeting] = useState('')

  // Fetch Hello World message
  useEffect(() => {
    fetch('http://localhost:8000/api/hello/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  // Fetch all greetings
  const loadGreetings = () => {
    fetch('http://localhost:8000/api/greetings/')
      .then(res => res.json())
      .then(data => setGreetings(data))
  }

  useEffect(() => {
    loadGreetings()
  }, [])

  // Add new greeting
  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:8000/api/greetings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newGreeting })
    })
      .then(res => res.json())
      .then(() => {
        setNewGreeting('')  // Clear input
        loadGreetings()     // Reload greetings
      })
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Greeting</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newGreeting}
            onChange={(e) => setNewGreeting(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter your greeting"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">All Greetings</h2>
        {greetings.map(greeting => (
          <div 
            key={greeting.id}
            className="border p-4 mb-2 rounded"
          >
            {greeting.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App