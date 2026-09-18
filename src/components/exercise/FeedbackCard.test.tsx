import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackCard } from "./FeedbackCard";

describe("FeedbackCard", () => {
  it("mostra a mensagem de acerto quando correct é true", () => {
    render(<FeedbackCard correct />);
    expect(screen.getByText(/muito bem, você acertou/i)).toBeInTheDocument();
  });

  it("mostra a mensagem de tentativa quando correct é false", () => {
    render(<FeedbackCard correct={false} />);
    expect(screen.getByText(/ainda não é isso/i)).toBeInTheDocument();
  });

  it("não mostra recomendação quando ela ainda não chegou (undefined)", () => {
    render(<FeedbackCard correct />);
    expect(screen.queryByText(/avançar|revisar|praticando/i)).not.toBeInTheDocument();
  });

  it("mostra o rótulo correspondente para cada ação da recomendação", () => {
    const { rerender } = render(
      <FeedbackCard
        correct
        recommendation={{ action: "advance", concept: "print", difficulty: 1, reason: "" }}
      />,
    );
    expect(screen.getByText(/pronto para avançar/i)).toBeInTheDocument();

    rerender(
      <FeedbackCard
        correct
        recommendation={{ action: "maintain", concept: "print", difficulty: 1, reason: "" }}
      />,
    );
    expect(screen.getByText(/continue praticando/i)).toBeInTheDocument();

    rerender(
      <FeedbackCard
        correct={false}
        recommendation={{ action: "review", concept: "print", difficulty: 1, reason: "" }}
      />,
    );
    expect(screen.getByText(/vale revisar/i)).toBeInTheDocument();
  });
});
