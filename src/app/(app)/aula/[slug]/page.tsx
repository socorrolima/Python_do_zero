import { notFound } from "next/navigation";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { getLessonBySlug, getAllLessonsInOrder } from "@/data/curriculum";

export function generateStaticParams() {
  return getAllLessonsInOrder().map((lesson) => ({ slug: lesson.slug }));
}

export default async function AulaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getLessonBySlug(slug);

  if (!found) notFound();

  return <LessonLayout lesson={found.lesson} />;
}
