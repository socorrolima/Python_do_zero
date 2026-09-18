import { ModuleMap } from "@/components/progress/ModuleMap";
import { getModules } from "@/lib/exercises/content";

export default async function AprenderPage() {
  const modules = await getModules();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">Trilha de aprendizagem</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Os Módulos 1 e 2 têm aulas liberadas. Os demais chegam nas próximas fases.
      </p>
      <ModuleMap modules={modules} />
    </div>
  );
}
