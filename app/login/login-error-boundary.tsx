// @/app/login/login-error-boundary.tsx
'use client'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'

export function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error
  resetErrorBoundary: () => void 
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">
            We encountered an issue during sign-in
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <p className="font-medium text-red-800">Error details:</p>
          <pre className="mt-2 overflow-auto text-sm text-red-700">
            {error?.message}
          </pre>
        </div>
        <Button 
          onClick={resetErrorBoundary}
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}

export default function LoginErrorBoundary({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  )
}