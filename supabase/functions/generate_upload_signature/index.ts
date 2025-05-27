import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.140.0/hash/mod.ts";

const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY")!;
const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET")!;
const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;

serve(async (req) => {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "produtos";
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  const hash = createHash("sha1");
  hash.update(paramsToSign + CLOUDINARY_API_SECRET);
  const signature = hash.toString();

  return new Response(
    JSON.stringify({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
