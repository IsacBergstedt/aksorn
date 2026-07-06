import { redirect } from "next/navigation";

// The Thai Words section became Thai Phrases (renamed 2026-07-06);
// this stub keeps old bookmarks and links working.
export default function WordsRedirect() {
  redirect("/phrases");
}
