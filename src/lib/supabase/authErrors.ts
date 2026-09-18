/**
 * Traduz as mensagens de erro do Supabase Auth para um português claro,
 * seguindo o mesmo princípio pedagógico dos erros de código (item 9 do
 * prompt mestre): explicar o que aconteceu, nunca só o erro técnico.
 */
export function translateAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "User already registered": "Já existe uma conta com este e-mail. Tente entrar.",
    "Password should be at least 6 characters": "A senha precisa ter pelo menos 6 caracteres.",
    "Email not confirmed": "Confirme seu e-mail antes de entrar — verifique sua caixa de entrada.",
    "Unable to validate email address: invalid format": "Digite um e-mail válido.",
  };
  return known[message] ?? "Não foi possível concluir. Verifique os dados e tente novamente.";
}
