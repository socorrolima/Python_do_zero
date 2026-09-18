import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { getModules } from "@/lib/exercises/content";

export default async function ProgressoPage() {
  const modules = await getModules();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Meu progresso</h1>
      <DashboardSummary modules={modules} />
    </div>
  );
}
