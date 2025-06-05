'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { setAuthCookies, clearAuthCookies } from '@/lib/auth/cookieHelpers'

export async function signInWithPasswordAction(
  email: string,
  password: string
) {
  const { supabase } = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw new Error(error.message)

  await setAuthCookies(data.session!)
  redirect('/')                       // ou retorne algo se preferir
}

export async function signOutAction() {
  const { supabase } = await createSupabaseServerClient()
  await supabase.auth.signOut()
  await clearAuthCookies()
  redirect('/login')
}
