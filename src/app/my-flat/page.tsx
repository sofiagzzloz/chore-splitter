'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Copy } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function MyFlatPage() {
  const [flatId, setFlatId] = useState<string | null>(null)
  const [flatName, setFlatName] = useState<string>('')
  const [flatCode, setFlatCode] = useState<string>('')
  const [members, setMembers] = useState<any[]>([])
  const [isCreator, setIsCreator] = useState(false)
  const [editName, setEditName] = useState(flatName)

  useEffect(() => {
    const fetchFlatInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('current_flat_id')
        .eq('id', user.id)
        .single()

      if (!profile?.current_flat_id) return

      setFlatId(profile.current_flat_id)

      const { data: flatData } = await supabase
        .from('flats')
        .select('name, flat_code, created_by')
        .eq('id', profile.current_flat_id)
        .single()

        if (flatData) {
            setFlatName(flatData.name)
            setEditName(flatData.name)
            setFlatCode(flatData.flat_code)
          
            if (flatData.created_by === user.id) {
              setIsCreator(true)
            }
          }

      const { data: membersData } = await supabase
        .from('flat_members')
        .select('user_id, profiles(display_name)')
        .eq('flat_id', profile.current_flat_id)

      if (membersData) setMembers(membersData)
    }

    fetchFlatInfo()
  }, [])

  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(flatCode)
    alert('Invite code copied!')
  }

  const handleLeaveFlat = async () => {
    const confirmed = confirm('Are you sure you want to leave this flat?')
  
    if (!confirmed || !flatId) return
  
    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (!user) return
  
    // Remove from flat_members
    const { error } = await supabase
      .from('flat_members')
      .delete()
      .eq('user_id', user.id)
      .eq('flat_id', flatId)
  
    if (error) {
      alert('Something went wrong: ' + error.message)
    } else {
      // Optional: clear from profiles
      await supabase
        .from('profiles')
        .update({ current_flat_id: null })
        .eq('id', user.id)
  
      alert('You’ve left the flat.')
      window.location.href = '/' // redirect to dashboard
    }
  }

  return (
    <div className="mt-20 flex flex-col items-center p-6 gap-6 max-w-2xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold text-center">My Flat: {flatName}</h1>

      <div className="w-full bg-blue-50 p-4 rounded shadow text-center">
        <p className="text-lg font-medium">Invite Code:</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-mono text-xl">{flatCode}</span>
          <button onClick={copyToClipboard} className="text-blue-600 hover:text-blue-800">
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="w-full mt-6">
        <h2 className="text-lg font-semibold mb-2">Roommates:</h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.user_id}
              className="bg-white p-3 rounded shadow text-gray-800"
            >
              {m.profiles?.display_name || 'Unnamed Roomie'}
            </li>
          ))}
        </ul>
      </div>

      {isCreator && (
        <div className="mt-10 w-full bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Flat Settings</h2>

            <label className="block text-sm mb-1">Rename Flat</label>
            <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
            />
            <button
            onClick={async () => {
                const { error } = await supabase
                .from('flats')
                .update({ name: editName })
                .eq('id', flatId)

                if (error) alert('Rename failed: ' + error.message)
                else {
                setFlatName(editName)
                alert('Flat renamed!')
                }
            }}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md shadow transition"
            >
            Save Name
            </button>

            <hr className="my-4" />

            <button
            onClick={async () => {
                const confirmed = confirm('⚠️ Are you sure? This will delete the flat and all its data.')

                if (!confirmed || !flatId) return

                const { error } = await supabase.from('flats').delete().eq('id', flatId)

                if (error) {
                  alert('Delete failed: ' + error.message)
                } else {
                  const {
                    data: { user },
                  } = await supabase.auth.getUser()

                  if (!user) return

                  await supabase
                    .from('profiles')
                    .update({ current_flat_id: null })
                    .eq('id', user.id)

                  alert('Flat deleted.')
                  window.location.href = '/'
                }
            }}
            className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md shadow transition"
            >
            Delete Flat
            </button>
        </div>
        )}

      <button
        onClick={handleLeaveFlat}
        className="mt-6 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md shadow transition"
        >
        Leave Flat
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