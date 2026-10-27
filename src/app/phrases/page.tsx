import { PhrasesPathMap } from "@/components/PhrasesPathMap";
import { ReadingFirstTip } from "@/components/ReadingFirstTip";

export default function PhrasesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Thai Phrases</h1>
        <p className="mt-2 text-muted-foreground">
          The main course: real Thai for real situations, in Thai script,
          tone by tone. From unit 11, turn familiar words into sentences and
          short conversations, then gradually expand what you can say.
        </p>
      </div>
      <ReadingFirstTip />
      <PhrasesPathMap />
    </main>
  );
}
