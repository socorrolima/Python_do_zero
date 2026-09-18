"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/supabase/authErrors";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });

    setLoading(false);
    if (authError) {
      setError(translateAuthError(authError.message));
      return;
    }
    setConfirmationSent(true);
  }

  if (confirmationSent) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-sm text-center">
          <h1 className="mb-2 text-xl font-semibold">Quase lá!</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Enviamos um e-mail de confirmação para <strong>{email}</strong>. Confirme
            para poder entrar.
          </p>
          <Link href="/login" className="mt-4 inline-block underline">
            Ir para o login
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <h1 className="mb-4 text-xl font-semibold">Criar conta</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border border-foreground/20 bg-transparent p-2 text-sm outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-foreground/20 bg-transparent p-2 text-sm outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-foreground/20 bg-transparent p-2 text-sm outline-none focus:ring-2 focus:ring-foreground/30"
            />
            <p className="mt-1 text-xs text-slate-500">Pelo menos 6 caracteres.</p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando conta…" : "Criar conta"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </p>
      </Card>
    </main>
  );
}
