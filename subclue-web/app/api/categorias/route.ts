import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    // O nome da tabela no banco é "categories"
    const { data, error } = await supabase
      .from('categories')
      .select('id, parent_id, name, slug, description')
      .order('name', { ascending: true })

    if (error) {
      console.error('[API][categorias] erro ao buscar categories:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar categories', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error('[API][categorias] erro inesperado:', err)
    return NextResponse.json(
      { message: 'Erro inesperado ao buscar categories', details: err.message },
      { status: 500 }
    )
  }
}
