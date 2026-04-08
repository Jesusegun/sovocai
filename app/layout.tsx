import type { Metadata } from "next";
import type { Session } from '@supabase/supabase-js';
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Navbar } from './components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sovocai — AI-Powered Vocational Learning Paths",
  description: "Master skilled trades with structured, AI-curated learning paths. Plumbing, Solar Installation, Electrical Wiring and more.",
};

export const dynamic = 'force-dynamic';

/**
 * Root layout with sticky header, role-aware navigation, and footer.
 * Fetches session + profile server-side and passes to client Navbar.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session: Session | null = null;
  let role = 'user';
  let fullName = '';

  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    session = sessionData.session;

    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .single();
      if (data) {
        role = data.role;
        fullName = data.full_name || '';
      }
    }
  } catch (error) {
    console.error('Supabase initialization failed in root layout:', error);
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col`}>
        <Navbar
          isAuthenticated={!!session}
          role={role}
          fullName={fullName}
        />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white rounded-lg p-1 px-2 font-bold text-sm tracking-tighter">Sovo<span className="text-blue-200">cai</span></div>
              </Link>
              <span className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-curated vocational learning paths. Built for the future of skilled trades.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
