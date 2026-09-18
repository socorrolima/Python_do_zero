import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route
 * Handlers. Lê/escreve a sessão via cookies HTTP — nunca é exposto ao
 * navegador. `setAll` pode falhar quando chamado de dentro de um Server
 * Component puro (que não pode escrever cookies); nesse caso o proxy
 * (`src/proxy.ts`) já cuida de manter a sessão atualizada, então o erro é
 * seguro de ignorar.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component — o proxy renova a sessão.
          }
        },
      },
    },
  );
}
