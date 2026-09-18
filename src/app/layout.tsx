import type { Metadata } from "next";
import "./globals.css";

// Fonte do sistema (sem next/font/google): evita chamada de rede em build
// e mantém carregamento imediato, sem custo de layout shift.

export const metadata: Metadata = {
  title: "Python do Zero",
  description:
    "Plataforma de ensino de Python para iniciantes absolutos, com prática guiada e feedback pedagógico.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
