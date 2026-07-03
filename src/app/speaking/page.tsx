import { Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SpeakingPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mic className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Practice Speaking
          </h1>
          <Badge variant="secondary">Coming soon</Badge>
          <p className="max-w-md text-muted-foreground">
            Tone and pronunciation drills with real audio arrive in Phase 2.
            Until then, keep building your script skills — they&apos;re the
            foundation everything else stands on.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
