type Tone = "neutral" | "success" | "locked";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-foreground/10 text-foreground",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  locked: "bg-foreground/5 text-foreground/40",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
