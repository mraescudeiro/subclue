#!/bin/sh
# Fails if the expected export is not found
grep -q "export async function createSupabaseServerClient" subclue-web/lib/supabase/server.ts
