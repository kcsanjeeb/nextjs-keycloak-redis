// @/app/login/login-content.tsx
'use client'

import { Button } from '@/components/ui/button'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LoginContentProps {
  message?: string | null
  from?: string | null
}

export default function LoginContent({ message, from }: LoginContentProps) {
  const router = useRouter()
  const callbackUrl = from || '/dashboard'
  const signInUrl = `/api/auth/signin/keycloak?callbackUrl=${encodeURIComponent(callbackUrl)}`

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session && !message) {
        router.push(callbackUrl)
      }
    }
    checkSession()
  }, [message, callbackUrl, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {message && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {message}
        </div>
      )}
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <form action={signInUrl} method="POST" className="mt-8 space-y-6">
          <Button type="submit" className="w-full">
            Sign in with Keycloak
          </Button>
        </form>
      </div>
    </div>
  )
}