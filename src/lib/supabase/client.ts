"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no navegador (Client Components). Cada chamada
 * cria uma instância nova — leve o suficiente para não precisar de
 * singleton — que compartilha a sessão via cookies com o cliente de
 * servidor (ver server.ts).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
