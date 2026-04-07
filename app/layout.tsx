import type { Metadata } from "next";
import type { Session } from '@supabase/supabase-js';
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { LogOut } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sovocai - AI Learning Paths",
  description: "Deterministic AI-like learning paths for skilled trades.",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session: Session | null = null;
  let role = 'user';

  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    session = sessionData.session;

    if (session?.user) {
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (data) role = data.role;
    }
  } catch (error) {
    console.error('Supabase initialization failed in root layout:', error);
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white rounded-lg p-1.5 px-3 font-bold text-xl tracking-tighter">Sovo<span className="text-blue-200">cai</span></div>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {session ? (
                <>
                  {role === 'instructor' && (
                    <Link href="/instructor" className="transition-colors hover:text-blue-500">Instructor Dashboard</Link>
                  )}
                  {role === 'admin' && (
                    <Link href="/admin" className="transition-colors hover:text-blue-500">Admin</Link>
                  )}
                  <form action="/auth/signout" method="post" className="flex items-center">
                    <button type="submit" className="flex items-center space-x-1 transition-colors hover:text-red-500">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="transition-colors hover:text-blue-500">Log in</Link>
                  <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
