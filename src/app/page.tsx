import { redirect } from "next/navigation";

// Reading Thai is the default landing section for now; when the Thai Words
// course goes live this flips to "/words".
export default function Home() {
  redirect("/reading");
}
