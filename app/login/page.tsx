// @/app/login/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import LoginErrorBoundary from './login-error-boundary'
import LoginContent from './login-content'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const from = searchParams.get('from')

  return (
    <LoginErrorBoundary>
      <LoginContent message={message} from={from} />
    </LoginErrorBoundary>
  )
}