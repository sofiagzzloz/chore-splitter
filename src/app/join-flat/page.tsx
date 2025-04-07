'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react' // icon lib
import Navbar from '../components/Navbar'

export default function JoinFlatPage() {
  const [flatId, setFlatId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoinFlat = async () => {
    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert('You must be logged in')
      setLoading(false)
      return
    }

    const {
        data: flat,
        error: codeError,
      } = await supabase
        .from('flats')
        .select('id')
        .eq('flat_code', flatId.toLowerCase()) // assuming they input the code here
        .single()
      
      if (codeError || !flat) {
        alert('Flat code not found.')
        setLoading(false)
        return
      }
      
      const { error } = await supabase.from('flat_members').insert([
        {
          flat_id: flat.id, // use ID from short code lookup
          user_id: user.id,
        },
      ])

    if (error) {
      alert(`Failed to join: ${error.message}`)
    } else {
      alert('Flat joined!')
      setFlatId('')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center p-6 gap-6 max-w-2xl mx-auto mt-12">
        <Navbar />
      <h1 className="text-2xl font-bold">Join a Flat</h1>
      <input
        className="border p-2 rounded w-full max-w-xs"
        type="text"
        placeholder="Enter Flat ID"
        value={flatId}
        onChange={(e) => setFlatId(e.target.value)}
      />
      <button
        onClick={handleJoinFlat}
        disabled={loading || !flatId}
        className="w-full py-2 rounded-md font-medium transition bg-blue-200 hover:bg-blue-300 text-gray-800 shadow">
        {loading ? 'Joining...' : 'Join Flat'}
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