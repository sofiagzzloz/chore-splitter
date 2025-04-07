'use client'

import { useEffect, useState } from 'react'
import { supabase } from './utils/supabaseClient'
import Link from 'next/link'
import Navbar from './components/Navbar'

type Flat = {
  id: string
  name: string
  flat_code: string
}

type FlatMemberWithFlat = {
  flat_id: string
  flats: Flat | null
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [flatId, setFlatId] = useState<string | null>(null)
  const [flats, setFlats] = useState<Flat[]>([])
  const [chores, setChores] = useState<any[]>([])

  useEffect(() => {
    const fetchUserAndFlats = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user || error) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      const { data, error: flatsError } = await supabase
        .from('flat_members')
        .select('flat_id, flats(id, name, flat_code)')
        .eq('user_id', user.id)

      if (!flatsError && data) {
        const typedData = data as unknown as FlatMemberWithFlat[]
        const userFlats: Flat[] = typedData
          .map(entry => entry.flats)
          .filter((f): f is Flat => f !== null)

        setFlats(userFlats)

        const storedFlat = localStorage.getItem('selectedFlat')
        const foundFlat = userFlats.find(f => f.id === storedFlat)

        if (foundFlat) {
          setFlatId(foundFlat.id)
        } else if (userFlats.length > 0) {
          const firstFlatId = userFlats[0].id
          setFlatId(firstFlatId)
          localStorage.setItem('selectedFlat', firstFlatId)
        }
      }

      setLoading(false)
    }

    fetchUserAndFlats()
  }, [])

  useEffect(() => {
    const fetchChores = async () => {
      if (!flatId) return
  
      const { data, error } = await supabase
        .from('chores')
        .select('id, name, is_complete, assigned_to, profiles:assigned_to(display_name)')
        .eq('flat_id', flatId)
        .order('created_at', { ascending: false })
  
      if (!error && data) {
        setChores(data)
      }
    }
  
    fetchChores()
  }, [flatId])

  const handleFlatChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setFlatId(selected)
    localStorage.setItem('selectedFlat', selected)
  
    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (user) {
      await supabase
        .from('profiles')
        .update({ current_flat_id: selected })
        .eq('id', user.id)
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="mt-20 flex flex-col items-center p-6 gap-6 max-w-2xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Hello!</h1>

      <h2 className="text-lg font-semibold mb-2">Your Flats:</h2>
      <select
        value={flatId ?? ''}
        onChange={handleFlatChange}
        className="w-full max-w-xs px-3 py-2 rounded border shadow"
      >
        {flats.map(f => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      {flatId && (
      <p className="text-gray-700 font-medium">
        You're currently viewing:{" "}
        <span className="text-blue-700 font-semibold">
          {flats.find(f => f.id === flatId)?.name || '—'}
        </span>
      </p>
    )}

      <Link 
        href="/my-flat"
        className="w-full bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium py-2 px-4 rounded-md shadow transition text-center"
      >
        View Flat
      </Link>



    <h2 className="text-lg font-semibold mt-6 mb-2">Your Chores:</h2>
    {chores.length === 0 ? (
      <p className="text-gray-500 italic">No chores yet.</p>
    ) : (
      <ul className="space-y-2 w-full">
        {chores.map(chore => (
          <li
            key={chore.id}
            className={`p-3 rounded shadow border flex justify-between items-center ${
              chore.is_complete ? 'bg-green-100 line-through text-gray-500' : 'bg-white'
            }`}
          >
            <span>{chore.name}</span>
            <span className="text-sm text-gray-500">
              {chore.profiles?.display_name || 'Unassigned'}
            </span>
          </li>
        ))}
      </ul>
    )}

      <Link 
        href="/create-flat"
        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md shadow transition text-center"
      >
        Create a Flat
      </Link>

      <Link 
        href="/join-flat"
        className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-md shadow transition text-center"
      >
        Join a Flat
      </Link>

      <Link 
        href="/profile-setup"
        className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded-md shadow transition text-center"
      >
        Set Display Name
      </Link>

      <Link 
        href="/chores"
        className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-md shadow transition text-center"
      >
        Our Chores 
      </Link>
    </div>
  )
}