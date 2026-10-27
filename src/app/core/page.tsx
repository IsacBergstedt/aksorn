import type { Metadata } from "next";
import { CoreCourse } from "@/components/CoreCourse";

export const metadata: Metadata = { title: "Core 1,000 — Aksorn" };

export default function CorePage() {
  return <CoreCourse />;
}
