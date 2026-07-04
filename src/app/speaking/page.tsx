import { SpeakingPractice } from "@/components/speaking/SpeakingPractice";

export const metadata = { title: "Practice Speaking — Aksorn" };

export default function SpeakingPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 pb-24 md:pb-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Practice Speaking</h1>
        <p className="mt-1 text-muted-foreground">
          Hear the target, record yourself, and compare by ear — no scoring,
          just your ear getting sharper.
        </p>
      </div>
      <SpeakingPractice />
    </main>
  );
}
