import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Velocity Dashboard | Totem Interactive",
  description: "Track your AI prompt efficiency and usage statistics with the Totem Interactive Velocity Dashboard.",
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
