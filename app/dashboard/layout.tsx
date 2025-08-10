// @/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { validateSession } from '@/app/lib/session-utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
   const { valid, error } = await validateSession();
  
  if (!valid) {
    // Only redirect if not coming from login page
    const loginUrl = new URL('/login', process.env.NEXTAUTH_URL);
    if (error) loginUrl.searchParams.set('message', error);
    redirect(loginUrl.toString());
  }
  return (
    <div className="flex min-h-screen flex-col">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <form action="/api/auth/signout" method="POST">
            <button 
              type="submit"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}