import { describe, expect, it } from "vitest";
import { matchesExpectedOutput } from "./pyodideRunner";

// `runPython` depende de Worker/Pyodide reais (navegador) — fora do escopo de
// unit test (ver ressalva em DEVELOPMENT.md/README.md: nunca testado num
// navegador real). Aqui cobrimos só a validação de resposta, que é pura.
describe("matchesExpectedOutput", () => {
  it("considera correto quando a saída bate linha a linha com o esperado", () => {
    expect(matchesExpectedOutput(["Maria"], ["Maria"])).toBe(true);
  });

  it("considera incorreto quando falta ou sobra alguma linha", () => {
    expect(matchesExpectedOutput(["Maria"], ["Maria", "25"])).toBe(false);
    expect(matchesExpectedOutput(["Maria", "25"], ["Maria"])).toBe(false);
  });

  it("considera incorreto quando o conteúdo de uma linha difere", () => {
    expect(matchesExpectedOutput(["maria"], ["Maria"])).toBe(false);
  });

  it("é sensível à ordem das linhas", () => {
    expect(matchesExpectedOutput(["25", "Maria"], ["Maria", "25"])).toBe(false);
  });

  it("considera igual quando ambos são vazios", () => {
    expect(matchesExpectedOutput([], [])).toBe(true);
  });
});
