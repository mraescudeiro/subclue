'use client'

import HeaderClient from '@/components/HeaderClient'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useUserRole } from '@/lib/useUserRole'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type ProfileFormData = {
  fullName?: string
  cpf?: string
  birthDate?: string
  companyName?: string
  cnpj?: string
  phone?: string
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { role, loading: loadingRole } = useUserRole(user?.id)
  const { register, handleSubmit, formState } = useForm<ProfileFormData>()

  // null = ainda não carregou / não sabemos se precisa completar
  const [needsCompletion, setNeedsCompletion] = useState<boolean | null>(null)

  // 1) busca status do perfil e, se já completo, manda pra home
  useEffect(() => {
    if (!loadingRole && user) {
      fetch('/api/profile/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.profile_complete) {
            router.replace('/')
          } else {
            setNeedsCompletion(true)
          }
        })
    }
  }, [loadingRole, user, router])

  // 2) envia atualização parcial
  const onSubmit = async (vals: ProfileFormData) => {
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vals),
    })
    if (res.ok) {
      router.replace('/')
    }
  }

  // enquanto carrega role ou status, ou se ainda não sabemos que precisa completar, não renderiza nada
  if (loadingRole || needsCompletion === null || !role) {
    return null
  }

  return (
    <>
      <HeaderClient initialUser={user} />

      <main className="max-w-md mx-auto my-16 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Complete seu perfil</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {role === 'assinante' ? (
            <>
              <div>
                <label className="block text-sm font-medium">Nome completo</label>
                <input
                  {...register('fullName', { required: true })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">CPF</label>
                <input
                  {...register('cpf', { required: true })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Data de nascimento</label>
                <input
                  type="date"
                  {...register('birthDate', { required: true })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium">Nome da empresa</label>
                <input
                  {...register('companyName', { required: true })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">CNPJ</label>
                <input
                  {...register('cnpj', { required: true })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Telefone</label>
                <input
                  {...register('phone', { required: true })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full py-2 bg-[#1b2462] text-white rounded disabled:opacity-50"
          >
            {formState.isSubmitting ? 'Salvando...' : 'Confirmar'}
          </button>
        </form>
      </main>
    </>
  )
}
