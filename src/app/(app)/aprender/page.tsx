import { CourseSelector } from "@/components/progress/CourseSelector";
import { getCourses } from "@/lib/exercises/content";

export default async function AprenderPage() {
  const courses = await getCourses();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">Cursos</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Escolha um curso para ver sua trilha de aprendizagem.
      </p>
      <CourseSelector courses={courses} />
    </div>
  );
}
