import { TRPCReactProvider } from "@/trpc/Client";
import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next"
import "./globals.css";
import { Toaster } from "sonner";
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tandemly",
  description: "Orchestrating your learning journey with AI Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <NuqsAdapter>
    <TRPCReactProvider>
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Toaster/>
        {children}
      </body>
    </html>
    </TRPCReactProvider>
    </NuqsAdapter>
  );
}
