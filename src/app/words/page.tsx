import { LessonPath } from "@/components/LessonPath";
import { wordsUnits } from "@/content";

export default function WordsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Thai Words</h1>
        <p className="mt-2 text-muted-foreground">
          Build your vocabulary in Thai script, one unit at a time. Each unit
          unlocks when you complete the one before it.
        </p>
      </div>
      <LessonPath units={wordsUnits} />
    </main>
  );
}
