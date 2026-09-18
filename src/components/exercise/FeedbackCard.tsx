import type { AdaptiveRecommendation } from "@/lib/learning/AdaptiveLearningService";

interface FeedbackCardProps {
  correct: boolean;
  recommendation?: AdaptiveRecommendation;
}

const ACTION_LABEL: Record<AdaptiveRecommendation["action"], string> = {
  advance: "Você está pronto para avançar.",
  maintain: "Continue praticando este conceito antes de avançar.",
  review: "Vale revisar este conceito antes de seguir.",
};

export function FeedbackCard({ correct, recommendation }: FeedbackCardProps) {
  return (
    <div
      role="status"
      className={`rounded-lg border p-4 ${
        correct
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-amber-500/40 bg-amber-500/10"
      }`}
    >
      <p className="font-semibold">
        {correct ? "✅ Muito bem, você acertou!" : "Ainda não é isso — tente de novo."}
      </p>
      {recommendation && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {ACTION_LABEL[recommendation.action]}
        </p>
      )}
    </div>
  );
}
