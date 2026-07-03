import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// Looped style matches how Thai is taught in print — learners must not see
// the glyphs in a fallback font. Packaged fonts keep builds offline-capable.
import "@fontsource/noto-sans-thai-looped/400.css";
import "@fontsource/noto-sans-thai-looped/500.css";
import "@fontsource/noto-sans-thai-looped/600.css";
import "@fontsource/noto-sans-thai-looped/700.css";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { SectionTabs } from "@/components/SectionTabs";

export const metadata: Metadata = {
  title: "Aksorn — Learn to read Thai",
  description:
    "Script-first Thai for serious learners: consonant classes, vowels, and tone rules taught through bite-sized lessons and spaced repetition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables must live on <html>: the font-sans rule applies there,
    // and CSS variables set on <body> aren't visible to it.
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <Header />
          {children}
          <SectionTabs variant="mobile" />
        </AuthProvider>
      </body>
    </html>
  );
}
