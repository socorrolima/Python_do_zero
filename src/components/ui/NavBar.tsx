import Link from "next/link";

const LINKS = [
  { href: "/aprender", label: "Trilha" },
  { href: "/laboratorio", label: "Laboratório" },
  { href: "/progresso", label: "Meu progresso" },
];

export function NavBar() {
  return (
    <header className="border-b border-foreground/10">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex max-w-4xl items-center justify-between p-4"
      >
        <Link href="/" className="font-semibold">
          Python do Zero
        </Link>
        <ul className="flex gap-4 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
