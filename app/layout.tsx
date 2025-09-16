import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Modern clean sans font
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hundred Studios – App User Survey",
  description:
    "Participate in the official Hundred Studios app survey. Your feedback helps us improve our products and create better experiences for our users.",
  keywords: [
    "Hundred Studios",
    "app survey",
    "user feedback",
    "product research",
    "app experience",
    "survey",
    "feedback",
    "technology",
  ],
  authors: [{ name: "Hundred Studios Team" }],
  openGraph: {
    title: "Hundred Studios – App User Survey",
    description:
      "Share your thoughts in the Hundred Studios app survey. Help us shape the future of our apps!",
    url: "survey.hundredstudios.tech",
    siteName: "Hundred Studios",
    images: [
      {
        url: "/Screenshot 2025-09-16 153217.png",
        width: 1200,
        height: 630,
        alt: "Hundred Studios logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased bg-neutral-950 text-neutral-100 min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-10">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
