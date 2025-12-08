import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase'; // Assuming you have a Supabase types file

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

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
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

  // 1. Sign in the user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/admin/login?error=Could not authenticate user`,
      { status: 301 }
    );
  }

  // 2. Get user session to retrieve user ID
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(
      `${requestUrl.origin}/admin/login?error=User session not found`,
      { status: 301 }
    );
  }

  // 3. Query the public.profiles table to check for 'admin' role
  type ProfileQueryResult = { role: string | null } | null;
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single() as { data: ProfileQueryResult, error: Error | null };

  if (profileError || profile?.role !== 'admin') {
    // If user is not admin, sign them out and redirect with error
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${requestUrl.origin}/admin/login?error=Unauthorized access. Not an admin.`,
      { status: 301 }
    );
  }

  // On successful login and admin role verification, redirect to admin dashboard
  return NextResponse.redirect(`${requestUrl.origin}/admin/dashboard`, { status: 301 });
}