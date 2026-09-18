import { NavBar } from "@/components/ui/NavBar";
import { ProgressProvider } from "@/lib/learning/ProgressContext";
import { getModules } from "@/lib/exercises/content";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const modules = await getModules();

  return (
    <ProgressProvider modules={modules}>
      <NavBar />
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">{children}</main>
    </ProgressProvider>
  );
}
