'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function AddMembersPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || ''
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-sky-50 p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Invite Your Roomies 🧼</h1>
      <p className="text-gray-700">Share this code to join your flat:</p>
      <div className="bg-white px-6 py-3 rounded shadow text-lg font-mono">{code}</div>
      <button onClick={handleCopy} className="bg-blue-200 hover:bg-blue-300 text-gray-900 px-4 py-2 rounded">
        {copied ? 'Copied!' : 'Copy Code'}
      </button>

      <Link
    href="/"
    className="mt-6 text-blue-600 hover:text-blue-800 underline text-sm"
    >
    → Go to Dashboard
    </Link>

    </div>
  )
}