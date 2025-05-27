// app/(auth)/layout.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (name: string) => cookieStore.get(name)?.value },
    },
  )

  /* ✔️  getUser em vez de getSession */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/')

  return (
    <div className="min-h-screen w-full bg-[#f4f8fb] flex flex-col">
      <header className="py-4 w-full bg-[#22c2b6]">
        <div className="max-w-7xl mx-auto flex justify-center px-4">
          <Link href="/" aria-label="Página Inicial do Subclue">
            <Image
              src="/logos/Logo_final_filme.png"
              alt="Subclue"
              width={120}
              height={32}
              priority
            />
          </Link>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center justify-start">
        {children}
      </main>
    </div>
  )
}
