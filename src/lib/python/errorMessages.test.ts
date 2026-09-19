import { describe, expect, it } from "vitest";
import { translatePythonError } from "./errorMessages";

describe("translatePythonError", () => {
  it("extrai o nome da variável de um NameError e explica em português", () => {
    const raw = [
      'Traceback (most recent call last):',
      '  File "<exec>", line 1, in <module>',
      "NameError: name 'Socorro' is not defined",
    ].join("\n");

    const result = translatePythonError(raw);

    expect(result.pythonError).toBe("NameError");
    expect(result.pedagogicalMessage).toContain('"Socorro"');
    expect(result.pedagogicalMessage).not.toMatch(/traceback/i);
    expect(result.hint).toContain("aspas");
    expect(result.line).toBe(1);
  });

  it("usa a última ocorrência de 'File \"<exec>\", line N' quando há mais de uma (erro dentro de função)", () => {
    const raw = [
      'Traceback (most recent call last):',
      '  File "<exec>", line 5, in <module>',
      '  File "<exec>", line 2, in minha_funcao',
      "ZeroDivisionError: division by zero",
    ].join("\n");

    const result = translatePythonError(raw);
    expect(result.line).toBe(2);
  });

  it("devolve line null quando não há referência de linha no traceback", () => {
    const result = translatePythonError("TypeError: unsupported operand type(s)");
    expect(result.line).toBeNull();
  });

  it("cai no template genérico para um erro sem template pedagógico específico", () => {
    const result = translatePythonError("RecursionError: maximum recursion depth exceeded");
    expect(result.pythonError).toBe("RecursionError");
    expect(result.pedagogicalMessage).toContain("maximum recursion depth exceeded");
    expect(result.hint).toBeTruthy();
  });

  it("trata cada erro pedagógico coberto sem lançar exceção e sempre devolve hint", () => {
    const covered = [
      "NameError: name 'x' is not defined",
      "SyntaxError: invalid syntax",
      "IndentationError: unexpected indent",
      "TabError: inconsistent use of tabs and spaces",
      "TypeError: can only concatenate str (not \"int\") to str",
      "ValueError: invalid literal for int() with base 10: 'abc'",
      "ZeroDivisionError: division by zero",
      "IndexError: list index out of range",
      "KeyError: 'idade'",
      "AttributeError: 'int' object has no attribute 'append'",
      "ModuleNotFoundError: No module named 'requests'",
      "EOFError: EOF when reading a line",
    ];

    for (const raw of covered) {
      const result = translatePythonError(raw);
      expect(result.pedagogicalMessage.length).toBeGreaterThan(0);
      expect(result.hint.length).toBeGreaterThan(0);
      expect(result.pedagogicalMessage).not.toBe(raw);
    }
  });

  it("lida com uma string vazia sem lançar exceção", () => {
    expect(() => translatePythonError("")).not.toThrow();
  });
});
