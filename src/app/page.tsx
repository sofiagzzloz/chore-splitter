'use client'

import { useEffect, useState } from 'react'
import { supabase } from './utils/supabaseClient'
import Link from 'next/link'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [flatId, setFlatId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserAndFlat = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user || error) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      const { data, error: flatError } = await supabase
        .from('flat_members')
        .select('flat_id')
        .eq('user_id', user.id)
        .single()

      if (!flatError && data) {
        setFlatId(data.flat_id)
      }

      setLoading(false)
    }

    fetchUserAndFlat()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
      <h1 className="text-3xl font-bold">Welcome to Roomble 🧼</h1>
      <p className="text-lg">Logged in as: {user.email}</p>

      {flatId ? (
        <p className="text-green-600">You're in a flat 🎉</p>
      ) : (
        <p className="text-yellow-600">You’re not in a flat yet 👀</p>
      )}

    <div className="grid gap-2 mt-4 w-full max-w-xs">
    <Link href="/create-flat" className="bg-blue-500 text-white py-2 px-4 rounded text-center">Create a Flat</Link>
    <Link href="/join-flat" className="bg-purple-500 text-white py-2 px-4 rounded text-center">Join a Flat</Link>
    <Link href="/profile-setup" className="bg-indigo-500 text-white py-2 px-4 rounded text-center">Set Display Name</Link>
  </div>
    </div>
  )
}