'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react' 
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function ChoresPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [flatId, setFlatId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [fadeOutId, setFadeOutId] = useState<string | null>(null)
  const [flatmates, setFlatmates] = useState<any[]>([])
  const [assignedTo, setAssignedTo] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlat = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user || error) return

      setUserId(user.id)

      const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_flat_id')
      .eq('id', user.id)
      .single()
    
    if (profile?.current_flat_id) {
      setFlatId(profile.current_flat_id)
    }
    }

    fetchFlat()
  }, [])

  useEffect(() => {
    const fetchFlatmates = async () => {
      if (!flatId) return
  
      const { data, error } = await supabase
        .from('flat_members')
        .select('user_id, profiles(display_name)')
        .eq('flat_id', flatId)
  
      if (!error && data) setFlatmates(data)
    }
  
    fetchFlatmates()
  }, [flatId])

  const handleAddChore = async () => {
    if (!flatId || !userId || !name) return

    setLoading(true)

    const { error } = await supabase.from('chores').insert([
        {
          flat_id: flatId,
          assigned_to: assignedTo || userId, // fallback to self if none selected
          name,
        },
      ])

    if (error) alert(error.message)
    else {
      alert('Chore added!')
      setName('')
    }

    setLoading(false)
  }

  const [chores, setChores] = useState<any[]>([])

    useEffect(() => {
    const fetchChores = async () => {
        if (!flatId) return
        const { data, error } = await supabase
        .from('chores')
        .select('id, name, is_complete, assigned_to, profiles:assigned_to(display_name)')
        .eq('flat_id', flatId)
        .order('created_at', { ascending: false })

        if (!error && data) setChores(data)
    }

    if (flatId) fetchChores()
    }, [flatId])

    const markChoreComplete = async (choreId: string) => {
        setFadeOutId(choreId)
      
        // delay so animation can finish
        setTimeout(async () => {
          const { error } = await supabase
            .from('chores')
            .delete()
            .eq('id', choreId)
      
          if (error) alert(error.message)
          else {
            setChores((prev) => prev.filter((chore) => chore.id !== choreId))
            setFadeOutId(null)
          }
        }, 500)
      }

  return (
   <div className="flex flex-col items-center p-6 gap-6 max-w-2xl mx-auto mt-12">
        <Navbar />
      <h1 className="text-2xl font-bold">Add a Chore</h1>
      <input
        className="border p-2 rounded w-full max-w-xs"
        type="text"
        placeholder="e.g. Dishes, Vacuum, Trash"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        value={assignedTo ?? ''}
        onChange={(e) => setAssignedTo(e.target.value)}
        className="border p-2 rounded w-full max-w-xs"
        >
        <option value="">Assign to...</option>
        {flatmates.map((m) => (
            <option key={m.user_id} value={m.user_id}>
            {m.profiles?.display_name || 'Unnamed Roomie'}
            </option>
        ))}
        </select>
      <button
        onClick={handleAddChore}
        disabled={loading || !name}
        className="w-full py-2 rounded-md font-medium transition bg-blue-200 hover:bg-blue-300 text-gray-800 shadow">
        {loading ? 'Adding...' : 'Add Chore'}
      </button>

    <div className="mt-8 w-full max-w-md">
    <h2 className="text-lg font-semibold mb-2">Current Chores</h2>
    <ul className="space-y-2">
    <AnimatePresence>
    {chores.map((chore) => (
        <motion.li
        key={chore.id}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-4 rounded-lg shadow-sm border flex justify-between items-center transition-all duration-200 ${
            chore.is_complete || fadeOutId === chore.id
            ? 'bg-green-100 text-gray-500 line-through'
            : 'bg-white text-black hover:bg-gray-50'
        }`}
        >
        <div className="flex flex-col">
        <span className="font-medium">{chore.name}</span>
        <span className="text-xs text-gray-500">
            {chore.profiles?.display_name || 'Unassigned'}
        </span>
        </div>
        <button
            className="text-sm text-blue-500 underline"
            onClick={() => markChoreComplete(chore.id)}
        >
            Mark Done
        </button>
        </motion.li>
    ))}
    </AnimatePresence>
    </ul>
    </div>

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