// src/app/login/page.tsx (or /pages/login.tsx if using Pages Router)

'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = async () => {
    setLoading(true)
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) alert(error.message)
    else alert('Success!')
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-4">
      <h1 className="text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <input
        className="border p-2 rounded w-full max-w-xs"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 rounded w-full max-w-xs"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleAuth}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-blue-600 cursor-pointer"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </p>
    </div>
  )
}