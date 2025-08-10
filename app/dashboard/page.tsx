// @/app/dashboard/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/lib/auth';
import { getServerSession } from '@/app/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession();
  const signOutUrl = await signOut({ redirectTo: '/login' });
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Welcome, {session?.user?.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>You are successfully authenticated with Keycloak.</p>
                <div className="rounded-md bg-gray-100 p-4">
                  <h3 className="font-medium">Session Data:</h3>
                  <pre className="mt-2 overflow-x-auto text-sm">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
                <div className="pt-4">
                  <Link href="/api/auth/signout" className="text-sm text-blue-600 hover:underline">
                    Direct Sign Out Link
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}