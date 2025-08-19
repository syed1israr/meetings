import { TRPCReactProvider } from "@/trpc/Client";
import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
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
    <TRPCReactProvider>
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </TRPCReactProvider>
  );
}
