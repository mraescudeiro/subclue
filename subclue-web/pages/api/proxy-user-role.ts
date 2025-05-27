// subclue-web/pages/api/proxy-user-role.ts

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  await new Promise(resolve => req.on('end', resolve))

  const SUPABASE_FUNCTIONS_URL =
    process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL || 'http://127.0.0.1:54321'
  const url = `${SUPABASE_FUNCTIONS_URL}/functions/v1/resolve_user_role`

  // LOG para debug
  console.log("HEADERS:", req.headers)
  console.log("BODY:", body)

  const headers: Record<string, string> = {
    'Content-Type': req.headers['content-type'] || 'application/json',
  }
  if (req.headers['authorization']) {
    headers['Authorization'] = req.headers['authorization']
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  })

  const data = await response.json()
  // LOG para debug
  console.log("RESPONSE FROM EDGE:", data)
  res.status(response.status).json(data)
}
