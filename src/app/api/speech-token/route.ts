import { NextResponse } from "next/server";

/**
 * Mints a short-lived (~10 min) Azure Speech authorization token so the
 * browser can run pronunciation assessment directly against Azure with
 * the official SDK — audio never passes through our server, and the
 * subscription key never leaves it.
 *
 * This is deliberately the app's first server-side code (approved
 * 2026-07-07); it touches neither auth nor progress. Requires
 * AZURE_SPEECH_KEY + AZURE_SPEECH_REGION in the deployment environment
 * (already in .env.local for the audio generation script).
 */
export async function GET() {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    return NextResponse.json(
      { error: "Speech assessment is not configured" },
      { status: 503 },
    );
  }

  const res = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    {
      method: "POST",
      headers: { "Ocp-Apim-Subscription-Key": key },
      cache: "no-store",
    },
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: "Token request failed" },
      { status: 502 },
    );
  }

  const token = await res.text();
  return NextResponse.json(
    { token, region },
    { headers: { "Cache-Control": "no-store" } },
  );
}
