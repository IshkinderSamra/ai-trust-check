import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Trust Check",
  description:
    "Evaluate AI-generated answers for reliability, hallucination risk, issues found, summaries, and improved rewrites."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
