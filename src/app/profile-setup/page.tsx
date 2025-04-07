'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react' // icon lib

export default function ProfileSetupPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        alert('Not logged in')
        return
      }
      setUserId(user.id)
    }
    fetchUser()
  }, [])

  const handleSave = async () => {
    if (!userId) return
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, display_name: name })

    if (error) alert(error.message)
    else alert('Profile updated!')

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      <h1 className="text-xl font-bold">Set Your Display Name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded w-full max-w-xs"
        placeholder="e.g. Sof, Queen Goblin, etc."
      />
      <button
        onClick={handleSave}
        disabled={loading || !name}
        className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Name'}
      </button>
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  )
}