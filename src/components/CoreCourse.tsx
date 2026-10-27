"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Layers, Lock, RotateCcw, Search, Trophy, Volume2 } from "lucide-react";
import { corePilot, coreUnits, getWord, lessonById } from "@/content";
import frequency from "@/content/core-frequency.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/lib/progress/store";
import { useMounted } from "@/lib/use-mounted";
import { COURSE_FREE_ACCESS } from "@/lib/course-access";
import { playAudioKey } from "@/lib/audio";
import { cn } from "@/lib/utils";

const path = coreUnits.flatMap(u => u.lessonIds);
const pilotByThai = new Map(corePilot.map(e => [getWord(e.wordId).thai, e]));

export function CoreCourse() {
  const mounted = useMounted();
  const completions = useProgressStore(s => s.completions);
  const cards = useProgressStore(s => s.srsCards);
  const [view, setView] = useState<"lessons" | "words">("lessons");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);
  const introduced = new Set(mounted ? path.filter(id => completions[id])
    .flatMap(id => lessonById.get(id)!.teaches) : []);
  const reviewed = [...introduced].filter(id => cards[id]?.lastReviewedAt).length;
  const strengthening = [...introduced].filter(id => (cards[id]?.repetitions ?? 0) >= 3).length;
  const due = [...introduced].filter(id => cards[id] && new Date(cards[id].dueAt).getTime() <= Date.now()).length;
  const next = path.find(id => !mounted || !completions[id]);
  const query = search.trim().toLowerCase();
  const results = frequency.filter(row => {
    const example = pilotByThai.get(row.thai);
    const word = example ? getWord(example.wordId) : undefined;
    return !query || row.thai.includes(query) || word?.meaning.toLowerCase().includes(query) || word?.rtgs.includes(query);
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-indigo-100/70 via-card to-amber-50 p-6 dark:from-indigo-950/50 dark:to-card sm:p-8">
        <Layers aria-hidden className="absolute -right-5 -top-4 h-36 w-36 rotate-12 text-primary/5" />
        <div className="relative">
          <Badge className="mb-4 bg-primary/10 text-primary">100-word pilot · 20 lessons</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Core 1,000</h1>
          <p className="mt-2 text-xl font-semibold">Common words. Real sentences.</p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Learn five words at a time, then listen, fill the gaps, and build
            sentences with them. Start with 100 selected words from our
            1,000-word frequency bank.
          </p>
          <div className="mt-6 rounded-2xl border border-border/60 bg-card/80 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">Words introduced</p>
              <p className="text-2xl font-bold tabular-nums text-primary">{introduced.size}<span className="text-sm font-normal text-muted-foreground"> / 1,000</span></p>
            </div>
            <Progress aria-label="Words introduced toward 1,000" value={introduced.size / 10} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">{introduced.size}/100 in the playable pilot · introduced does not mean mastered</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>{reviewed} practiced in sentences</span>
            <span>{strengthening} with 3+ successful practice sessions</span>
            <span>{due} due for review</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {next && <Button render={<Link href={`/lesson/${next}`} />}>{introduced.size ? "Continue learning" : "Start the pilot"}<ArrowRight className="h-4 w-4" /></Button>}
            {due > 0 && <Button variant="outline" render={<Link href="/core/review" />}><RotateCcw className="h-4 w-4" />Review sentences ({due})</Button>}
          </div>
        </div>
      </section>

      <p className="my-5 text-sm leading-relaxed text-muted-foreground">
        Best after the <Link href="/phrases" className="font-medium text-primary underline underline-offset-4">Phrases foundations</Link>:
        these lessons reuse their everyday vocabulary. Follow the lesson order
        for gradual introductions, or explore freely.
      </p>

      <div className="mb-6 flex gap-2" role="group" aria-label="Course view">
        <Button variant={view === "lessons" ? "default" : "outline"} aria-pressed={view === "lessons"} onClick={() => setView("lessons")}><BookOpen className="h-4 w-4" />Lessons</Button>
        <Button variant={view === "words" ? "default" : "outline"} aria-pressed={view === "words"} onClick={() => setView("words")}><Layers className="h-4 w-4" />Word bank · 1,000</Button>
      </div>

      {view === "lessons" ? (
        <div className="space-y-6">
          {coreUnits.map(unit => {
            const completedCount = unit.lessonIds.filter(id => mounted && completions[id]).length;
            return (
              <Card key={unit.id} className="overflow-hidden border-t-4 border-t-indigo-300">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-5 flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">{unit.order}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold">{unit.title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{unit.description}</p>
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">{completedCount}/6</span>
                  </div>
                  <div className="space-y-2">
                    {unit.lessonIds.map(id => {
                      const lesson = lessonById.get(id)!;
                      const complete = mounted && !!completions[id];
                      const current = id === next;
                      const index = path.indexOf(id);
                      const available = COURSE_FREE_ACCESS || complete || index === 0 || (mounted && !!completions[path[index - 1]]);
                      const checkpoint = lesson.kind === "checkpoint";
                      const content = <>
                        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", complete ? "bg-amber-100 text-amber-700" : current ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>
                          {complete ? <Check className="h-4 w-4" /> : !available ? <Lock className="h-4 w-4" /> : checkpoint ? <Trophy className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{lesson.title}</span>
                          <span className="mt-1 block font-thai text-sm leading-relaxed text-muted-foreground">
                            {checkpoint ? "Sentence review · pass 80%" : lesson.teaches.map(id => getWord(id).thai).join(" · ")}
                          </span>
                        </span>
                        {available && <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      </>;
                      const className = cn("flex items-center gap-3 rounded-2xl border p-3 transition-colors", current ? "border-primary/30 bg-primary/5" : "border-transparent bg-secondary/40", available && "hover:border-primary/30 hover:bg-primary/5");
                      return available ? <Link key={id} href={`/lesson/${id}`} className={className}>{content}</Link> : <div key={id} aria-disabled className={cn(className, "opacity-60")}>{content}</div>;
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <div className="rounded-2xl border border-dashed p-6 text-center">
            <Badge variant="secondary">Coming later</Badge>
            <p className="mt-3 font-semibold">The next 900 words</p>
            <p className="mt-1 text-sm text-muted-foreground">The frequency bank is ready to browse. More sentence lessons will follow the pilot.</p>
          </div>
        </div>
      ) : (
        <section aria-label="Ranked word bank">
          <label htmlFor="core-search" className="mb-2 block text-sm font-medium">Find a word</label>
          <div className="relative">
            <Search aria-hidden className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input id="core-search" value={search} onChange={e => { setSearch(e.target.value); setVisibleCount(50); }} placeholder="Thai, or a pilot word’s English meaning…" className="h-10 w-full rounded-xl border bg-card pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          </div>
          <p className="my-3 text-xs text-muted-foreground">{results.length} entries · shown in corpus frequency order · definitions and examples available for pilot words</p>
          <div className="space-y-2">
            {results.slice(0, visibleCount).map(row => {
              const example = pilotByThai.get(row.thai);
              const word = example ? getWord(example.wordId) : undefined;
              return (
                <article key={row.thai} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-xs tabular-nums text-muted-foreground">#{row.sourceRank}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-thai text-xl font-semibold">{row.thai}</h3>
                      {word && <p className="mt-1 text-sm text-muted-foreground">{word.meaning}</p>}
                    </div>
                    {word ? <Button variant="ghost" size="icon" aria-label={`Hear ${word.thai}`} onClick={() => playAudioKey(word.audioKey, word.thai)}><Volume2 className="h-4 w-4" /></Button> : <Badge variant="secondary">Later</Badge>}
                  </div>
                  {example && <details className="mt-3 border-t pt-3">
                    <summary className="cursor-pointer text-xs font-medium text-primary">Sentence example</summary>
                    <div className="mt-3 flex items-start gap-3">
                      <button type="button" onClick={() => playAudioKey(example.audioKey, example.thai)} className="rounded-lg p-2 text-primary hover:bg-primary/10" aria-label={`Hear example for ${row.thai}`}><Volume2 className="h-4 w-4" /></button>
                      <div><p className="font-thai text-lg">{example.thai}</p><p className="mt-1 text-sm text-muted-foreground">{example.meaning}</p></div>
                    </div>
                  </details>}
                </article>
              );
            })}
            {results.length === 0 && <p className="rounded-xl border p-6 text-center text-sm text-muted-foreground">No matching words. Try Thai script; English search covers the pilot words.</p>}
          </div>
          {visibleCount < results.length && <Button variant="outline" className="mt-4 w-full" onClick={() => setVisibleCount(n => n + 50)}>Show 50 more</Button>}
        </section>
      )}

      <details className="mt-8 rounded-2xl border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <summary className="cursor-pointer font-semibold">About the frequency order</summary>
        <p className="mt-3">Ranks come from the written Thai National Corpus list distributed by <a className="text-primary underline" href="https://pythainlp.org/docs/5.3/api/corpus.html#pythainlp.corpus.tnc.word_freqs" target="_blank" rel="noreferrer">PyThaiNLP</a> (credit: Korakot Chaovavanich). This is a guide to common written Thai, rather than a universal ranking of everyday speech.</p>
        <p className="mt-2">The bank retains 1,000 unique Thai-script entries after removing punctuation, numerals, and mixed-script forms. Numbers shown are original corpus ranks, so there are gaps. The pilot selects 100 useful words from this bank and follows their frequency order; it is not the first 100 consecutive ranks. Supporting words come from the Phrases foundations.</p>
      </details>
    </main>
  );
}
