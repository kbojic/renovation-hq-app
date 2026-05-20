import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renovation HQ",
  description: "Shared renovation budget, contractor outreach, documents, and timeline workspace."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
