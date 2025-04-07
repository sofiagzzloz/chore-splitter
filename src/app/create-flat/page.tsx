'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react' 
import Navbar from '../components/Navbar'
import { generateFlatCode } from '../utils/generateFlatCode' // add this line
import { useRouter } from 'next/navigation'

export default function CreateFlatPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter() 



  const handleCreateFlat = async () => {
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
  
    const code = generateFlatCode()
  
    const { data: flatData, error: flatError } = await supabase
      .from('flats')
      .insert([
        {
          name,
          created_by: user.id,
          flat_code: code,
        },
      ])
      .select()
      .single()
  
    if (flatError || !flatData) {
      alert(flatError?.message || 'Failed to create flat')
      setLoading(false)
      return
    }
  
    // Add user to flat_members
    await supabase.from('flat_members').insert([
      {
        flat_id: flatData.id,
        user_id: user.id,
      },
    ])
  
    setLoading(false)
  
    // Redirect to add-members page with flat code
    router.push(`/add-members?code=${flatData.flat_code}`)
  }

  return (
    <div className="flex flex-col items-center p-6 gap-6 max-w-2xl mx-auto mt-12">
      <Navbar />
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
        className="w-full py-2 rounded-md font-medium transition bg-blue-200 hover:bg-blue-300 text-gray-800 shadow">
        {loading ? 'Creating...' : 'Create Flat'}
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