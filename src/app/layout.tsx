import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "DevLog — AI & Programming",
    template: "%s | DevLog",
  },
  description: "High-signal writing on AI and software engineering.",
  openGraph: {
    siteName: "DevLog",
    type: "website",
    locale: "en_US",
    url: APP_URL,
  },
  twitter: {
    card: "summary",
    title: "DevLog — AI & Programming",
    description: "High-signal writing on AI and software engineering.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
