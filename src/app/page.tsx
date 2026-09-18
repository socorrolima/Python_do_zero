import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Python do Zero</h1>
      <p className="max-w-md text-slate-600 dark:text-slate-300">
        Aprenda Python praticando desde a primeira aula. Sem experiência
        prévia necessária.
      </p>
      <div className="flex gap-4">
        <Link
          href="/cadastro"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Criar conta
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
