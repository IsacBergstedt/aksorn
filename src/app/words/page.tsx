import { WordsPathMap } from "@/components/WordsPathMap";

export default function WordsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Thai Words</h1>
        <p className="mt-2 text-muted-foreground">
          The main course: real Thai for real situations, in Thai script,
          tone by tone. Each unit unlocks when you complete the one before it.
        </p>
      </div>
      <WordsPathMap />
    </main>
  );
}
