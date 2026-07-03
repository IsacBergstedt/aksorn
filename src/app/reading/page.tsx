import { PathMap } from "@/components/PathMap";

export default function ReadingPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Learn to read Thai.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Master the script the way it actually works: consonant by consonant,
          class by class — the key that unlocks Thai tones.
        </p>
      </div>
      <PathMap />
    </main>
  );
}
