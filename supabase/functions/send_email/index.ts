import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;
const SENDGRID_FROM     = "no-reply@email.subclue.com"; // ou no-reply@subclue.com
const SENDGRID_REPLY_TO = "notification@subclue.com";

serve(async (req) => {
  // 1) Autenticação simples via Bearer token Supabase Auth (opcional)
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!auth) return new Response("Unauthorized", { status: 401 });

  // 2) Leia o payload JSON com { to, subject, text, html }
  const { to, subject, text, html } = await req.json();

  // 3) Monte o request para o SendGrid
  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from:      { email: SENDGRID_FROM, name: "Subclue" },
    reply_to:  { email: SENDGRID_REPLY_TO },
    subject,
    content: [
      { type: "text/plain", value: text || "" },
      { type: "text/html",  value: html || "" }
    ]
  };

  // 4) Envie
  const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method:  "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type":  "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("SendGrid error:", resp.status, errText);
    return new Response("Error sending email", { status: 502 });
  }

  return new Response("Email sent", { status: 200 });
});
