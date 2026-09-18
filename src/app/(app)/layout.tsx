import { NavBar } from "@/components/ui/NavBar";
import { ProgressProvider } from "@/lib/learning/ProgressContext";
import { getModules } from "@/lib/exercises/content";
import { getInitialProgress } from "@/lib/learning/progressServer";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [modules, initialProgress] = await Promise.all([getModules(), getInitialProgress()]);

  return (
    <ProgressProvider
      modules={modules}
      initialCompletedLessons={initialProgress.completedLessonSlugs}
    >
      <NavBar />
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">{children}</main>
    </ProgressProvider>
  );
}
