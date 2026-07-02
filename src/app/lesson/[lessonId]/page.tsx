import { notFound } from "next/navigation";
import { lessonById, lessons } from "@/content";
import { LessonClient } from "./LessonClient";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  if (!lessonById.has(lessonId)) notFound();
  return <LessonClient lessonId={lessonId} />;
}
