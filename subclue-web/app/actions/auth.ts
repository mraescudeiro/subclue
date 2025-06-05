'use server'

import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/createServerSupabase'

export async function signInWithPasswordAction(
  email: string,
  password: string
) {
  const { supabase } = await createServerSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw new Error(error.message)

  await supabase.auth.setSession(data.session!)
  redirect('/')                       // ou retorne algo se preferir
}

export async function signOutAction() {
  const { supabase } = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/login')
}
