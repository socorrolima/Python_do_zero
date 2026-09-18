import { NavBar } from "@/components/ui/NavBar";
import { ProgressProvider } from "@/lib/learning/ProgressContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <NavBar />
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">{children}</main>
    </ProgressProvider>
  );
}
