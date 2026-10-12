import { redirect } from "next/navigation";

// Start with useful words, audio, and spoken tones; reading is a companion track.
export default function Home() {
  redirect("/phrases");
}
