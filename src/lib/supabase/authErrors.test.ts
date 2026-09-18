import { describe, expect, it } from "vitest";
import { translateAuthError } from "./authErrors";

describe("translateAuthError", () => {
  it("traduz as mensagens conhecidas do Supabase Auth", () => {
    expect(translateAuthError("Invalid login credentials")).toBe(
      "E-mail ou senha incorretos.",
    );
    expect(translateAuthError("User already registered")).toContain("Já existe");
    expect(translateAuthError("Password should be at least 6 characters")).toContain(
      "6 caracteres",
    );
    expect(translateAuthError("Email not confirmed")).toContain("Confirme seu e-mail");
    expect(
      translateAuthError("Unable to validate email address: invalid format"),
    ).toContain("e-mail válido");
  });

  it("nunca expõe a mensagem técnica original para um erro desconhecido", () => {
    const result = translateAuthError("relation \"profiles\" does not exist");
    expect(result).not.toContain("relation");
    expect(result).not.toContain("profiles");
    expect(result).toBeTruthy();
  });
});
