'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
<nav className="bg-sky-200 text-gray-900 px-8 py-3 shadow-sm w-full flex justify-between items-center fixed top-0 left-0 z-50">
  <div className="flex gap-6">
    <Link href="/" className="hover:underline">Dashboard</Link>
    <Link href="/chores" className="hover:underline">Chores</Link>
    <Link href="/profile-setup" className="hover:underline">Profile</Link>
  </div>
  <button
    onClick={handleLogout}
    className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-md transition"
  >
    Logout
  </button>
</nav>
  )
}