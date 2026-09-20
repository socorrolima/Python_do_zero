import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renomeou middleware.ts para proxy.ts (mesma função, nome
// novo) — ver node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/proxy.md.

const PROTECTED_PREFIXES = ["/aprender", "/aula", "/laboratorio", "/progresso"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  // getUser() (não getSession()) valida o token com o servidor do Supabase
  // a cada request — mais lento, mas é o que garante que a sessão não foi
  // revogada. Necessário para manter os cookies de sessão renovados.
  //
  // Se .env.local ainda não tiver as credenciais reais do Supabase (por
  // exemplo, antes de a Fase 4 ser configurada no seu projeto), TANTO a
  // criação do client quanto a chamada a getUser() falham — nesse caso
  // tratamos como "sem sessão" em vez de derrubar a página com um erro 500.
  // Todo o bloco fica dentro do try, não só a chamada de rede.
  let user = null;
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.warn(
      "[proxy] Supabase não configurado ou inacessível — tratando como 'sem sessão'. Verifique NEXT_PUBLIC_SUPABASE_URL/ANON_KEY em .env.local.",
      err,
    );
  }

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // "workers/" (o worker do Pyodide, em public/workers/) precisa ficar de
  // fora: sem essa exclusão, toda vez que o navegador pede esse arquivo
  // estático, o proxy fazia uma chamada de rede ao Supabase
  // (auth.getUser()) antes de servi-lo — sem necessidade, já que é um
  // arquivo público. Se essa chamada demorasse ou falhasse, o arquivo do
  // worker nunca chegava a carregar (ficava "pendente" para sempre no
  // navegador), travando o Laboratório antes mesmo de o Python começar a
  // carregar. Bug real encontrado em produção — não confundir com lentidão
  // de rede do CDN do Pyodide, que é um problema diferente.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|workers/).*)"],
};