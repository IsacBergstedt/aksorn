import { redirect } from "next/navigation";

// Reading Thai is the default landing section for now; when Thai Phrases
// becomes the main track this flips to "/phrases".
export default function Home() {
  redirect("/reading");
}
