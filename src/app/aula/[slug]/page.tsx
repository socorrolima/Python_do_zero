export default async function AulaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">Aula: {slug}</h1>
      <p className="mt-2 text-slate-500">
        Conceito, exemplo, editor Python, exercício e feedback — implementado na Fase 3 em diante.
      </p>
    </main>
  );
}
