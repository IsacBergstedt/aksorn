"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecorderState =
  | "unsupported"
  | "idle"
  | "requesting"
  | "recording"
  | "recorded"
  | "denied";

/**
 * Self-assessment recorder: capture the learner's attempt with
 * MediaRecorder and play it back next to the target. Nothing is uploaded
 * or scored — the comparison loop is the exercise.
 */
export function Recorder({ onPlayTarget }: { onPlayTarget: () => void }) {
  const [state, setState] = useState<RecorderState>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setState("unsupported");
    }
    return () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
        recorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const start = async () => {
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // No explicit mimeType: Chrome/Firefox record webm/opus, Safari mp4 —
      // both play back fine from an object URL.
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = URL.createObjectURL(blob);
        setRecordingUrl(urlRef.current);
        setState("recorded");
      };
      recorder.start();
      setState("recording");
    } catch (err) {
      setState(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "denied"
          : "unsupported",
      );
    }
  };

  const stop = () => recorderRef.current?.stop();

  const playRecording = () => {
    if (recordingUrl) new Audio(recordingUrl).play().catch(() => {});
  };

  if (state === "unsupported") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Recording isn&apos;t supported in this browser. Try a recent Chrome,
        Firefox, or Safari.
      </p>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Microphone access was blocked. Allow the microphone for this site in
          your browser settings, then try again.
        </p>
        <Button variant="outline" onClick={start}>
          <Mic className="mr-2 h-4 w-4" /> Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {state === "recording" ? (
        <Button size="lg" variant="destructive" onClick={stop}>
          <Square className="mr-2 h-4 w-4" /> Stop recording
        </Button>
      ) : (
        <Button size="lg" onClick={start} disabled={state === "requesting"}>
          <Mic className="mr-2 h-4 w-4" />
          {state === "recorded" ? "Record again" : "Record yourself"}
        </Button>
      )}

      {state === "recording" && (
        <p className="text-sm text-muted-foreground">
          Listening&hellip; say it with the tone you heard.
        </p>
      )}

      {state === "recorded" && recordingUrl && (
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Compare — switch back and forth until they match:
          </p>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <Button variant="outline" onClick={onPlayTarget}>
              <Play className="mr-2 h-4 w-4" /> Target
            </Button>
            <Button variant="outline" onClick={playRecording}>
              <RotateCcw className="mr-2 h-4 w-4" /> My attempt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
