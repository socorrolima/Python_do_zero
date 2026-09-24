import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { getCourses, getModules } from "@/lib/exercises/content";

export default async function ProgressoPage() {
  const [courses, modules] = await Promise.all([getCourses(), getModules()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Meu progresso</h1>
      <DashboardSummary courses={courses} modules={modules} />
    </div>
  );
}
