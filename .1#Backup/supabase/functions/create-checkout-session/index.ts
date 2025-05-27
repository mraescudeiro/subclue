// Importa os tipos necessários e o cliente Supabase.
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Importa a biblioteca oficial do Stripe para Node.js (compatível com Deno)
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno&deno-std=0.132.0' // Use a versão mais recente compatível

// Define o tipo esperado para os dados da requisição (agora com varianteId)
interface RequestData {
  varianteId: string; // ID da produto_variante que o usuário quer assinar
}

console.log('Função create-checkout-session iniciada.')

serve(async (req: Request) => {
  // 1. Tratamento da Requisição e Autenticação
  // ------------------------------------------
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

  if (userError || !user) {
    console.error('Erro ao obter usuário ou usuário não autenticado:', userError)
    return new Response(JSON.stringify({ error: 'Usuário não autenticado' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }
  console.log('Usuário autenticado:', user.id)

  // Obtém os dados enviados no corpo da requisição (espera varianteId)
  let requestData: RequestData
  try {
    requestData = await req.json()
    // Verifica se varianteId foi enviado
    if (!requestData.varianteId) {
      throw new Error('varianteId é obrigatório')
    }
    console.log('Dados da requisição:', requestData)
  } catch (error) {
    console.error('Erro ao processar corpo da requisição:', error)
    // Ajusta mensagem de erro
    return new Response(JSON.stringify({ error: 'Corpo da requisição inválido ou faltando varianteId' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  // 2. Interação com o Banco de Dados Supabase
  // ------------------------------------------
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Busca a VARIANTE selecionada para obter o stripe_price_id
    const { data: varianteData, error: varianteError } = await supabaseAdmin
      .from('produto_variantes') // <<< MUDAÇA: Busca na tabela de variantes
      .select('stripe_price_id, ativo') // Pega o ID do preço e se está ativa
      .eq('id', requestData.varianteId) // <<< MUDAÇA: Usa o varianteId
      .single() // Espera encontrar apenas uma variante com esse ID

    // Verifica se a variante foi encontrada, está ativa e tem um stripe_price_id
    if (varianteError || !varianteData || !varianteData.stripe_price_id || !varianteData.ativo) {
      // Ajusta log e mensagens de erro
      console.error('Erro ao buscar variante, variante inativa ou sem stripe_price_id:', varianteError, varianteData)
      let errorMessage = 'Variante não encontrada ou inválida';
      if (varianteData && !varianteData.ativo) {
          errorMessage = 'Variante não está ativa';
      } else if (varianteData && !varianteData.stripe_price_id) {
          errorMessage = 'Variante não possui um preço Stripe associado';
      }
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      })
    }
    const stripePriceId = varianteData.stripe_price_id
    console.log('Stripe Price ID encontrado:', stripePriceId)

    // Busca o assinante correspondente ao usuário autenticado para obter/criar o stripe_customer_id
    // (Esta parte permanece igual)
    let stripeCustomerId: string | null = null;
    const { data: assinanteData, error: assinanteError } = await supabaseAdmin
      .from('assinantes')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (assinanteError) {
      console.error('Erro ao buscar assinante:', assinanteError)
      throw assinanteError
    }

    if (assinanteData && assinanteData.stripe_customer_id) {
      stripeCustomerId = assinanteData.stripe_customer_id
      console.log('Stripe Customer ID existente encontrado:', stripeCustomerId)
    } else {
      console.log('Nenhum Stripe Customer ID encontrado para o usuário. Criando um novo...')
    }

    // 3. Interação com a API do Stripe
    // ---------------------------------
    // (Esta parte permanece igual, pois já usa stripePriceId e stripeCustomerId)
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada nos segredos.')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16', // Use a versão da API desejada
      httpClient: Stripe.createFetchHttpClient()
    })

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      stripeCustomerId = customer.id
      console.log('Novo Stripe Customer criado:', stripeCustomerId)

      // Salva o novo stripe_customer_id no banco de dados Supabase
      if (assinanteData) { // Se já existe um registro 'assinantes' para este user_id
         const { error: updateError } = await supabaseAdmin
           .from('assinantes')
           .update({ stripe_customer_id: stripeCustomerId })
           .eq('user_id', user.id)
         if (updateError) {
             console.error('Erro ao atualizar stripe_customer_id no assinante existente:', updateError);
             throw updateError;
         }
         console.log('Stripe Customer ID atualizado no assinante existente.')
      } else { // Se não existe registro 'assinantes'
         const { error: insertError } = await supabaseAdmin
           .from('assinantes')
           .insert({ user_id: user.id, stripe_customer_id: stripeCustomerId })
         if (insertError) {
             console.error('Erro ao inserir novo assinante com stripe_customer_id:', insertError);
             throw insertError;
         }
         console.log('Novo registro de assinante criado com Stripe Customer ID.')
      }
    }

    // Cria a Sessão de Checkout do Stripe
    console.log('Criando sessão de checkout do Stripe...')
    const siteUrl = Deno.env.get('SITE_URL')
    if (!siteUrl) {
        throw new Error('SITE_URL não configurada nos segredos/env.')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: stripePriceId, quantity: 1 }], // Usa o stripePriceId da variante
      success_url: `${siteUrl}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pagamento/cancelado`,
      // Adicione outras opções se necessário (ex: allow_promotion_codes: true)
    })

    console.log('Sessão de checkout criada:', session.id)

    // 4. Retorna a URL da Sessão de Checkout para o Frontend
    // -----------------------------------------------------
    return new Response(JSON.stringify({ sessionId: session.id, checkoutUrl: session.url }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Erro inesperado na função:', error)
    return new Response(JSON.stringify({ error: `Erro interno do servidor: ${error.message}` }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
})

/*
 ** Próximos Passos e Considerações:**
 *
 * 1.  **Variáveis de Ambiente/Segredos:**
 * - `SITE_URL`: **Precisa ser definida** no `supabase/.env` (local) e nos segredos (nuvem).
 * - As outras chaves (Stripe, Supabase) já estão configuradas.
 *
 * 2.  **Frontend:**
 * - Chamar esta função com POST, enviando `{ "varianteId": "..." }` no corpo e o token de autenticação. <<< MUDANÇA
 * - Redirecionar para `checkoutUrl` recebido na resposta.
 * - Ter as rotas `/pagamento/sucesso` e `/pagamento/cancelado`.
 *
 * 3.  **Webhooks:** Ainda são necessários para confirmar o pagamento e atualizar o status da assinatura no banco do Subclue.
 *
 * 4.  **Testes:** Precisaremos testar este fluxo localmente.
 */
