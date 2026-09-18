import Link from "next/link";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-slate-500">
        Cadastro com Supabase Auth — implementado na Fase 4. Por enquanto, explore
        a trilha livremente.
      </p>
      <Link href="/aprender" className="underline">
        Ir para a trilha de aprendizagem
      </Link>
    </main>
  );
}
