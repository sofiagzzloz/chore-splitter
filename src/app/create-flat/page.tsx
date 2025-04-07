'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function CreateFlatPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateFlat = async () => {
    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert('You must be logged in')
      return
    }

    const { error } = await supabase.from('flats').insert([
      {
        name,
        created_by: user.id,
      },
    ])

    if (error) {
      alert(error.message)
    } else {
      alert('Flat created!')
      setName('')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
      <h1 className="text-2xl font-bold">Create a New Flat</h1>
      <input
        className="border p-2 rounded w-full max-w-xs"
        type="text"
        placeholder="Flat name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreateFlat}
        disabled={loading || !name}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Flat'}
      </button>
    </div>
  )
}