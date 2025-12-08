import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import type { Database } from '@/types/supabase';

interface ResponseCookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  secure?: boolean;
  value?: string;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: ResponseCookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: { path: string }) {
          cookieStore.delete(name); // Removed options, simplified to delete by name
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  type ProfileQueryResult = { role: string | null } | null;
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single() as { data: ProfileQueryResult, error: Error | null };

  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/admin/login?error=Unauthorized access.');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Admin Dashboard</h2>
        <p className="text-center text-lg text-gray-800">Welcome, Admin!</p>
        <div className="flex justify-center">
          <Link href="/admin/login">
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout (placeholder)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
