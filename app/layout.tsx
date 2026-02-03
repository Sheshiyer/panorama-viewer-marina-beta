import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marina One | 360° Panoramic Views | Ashwin Sheth Group",
  description: "Experience breathtaking 360° panoramic views from Marina One luxury residences. Explore floors 44F to 75F with dynamic time-of-day views of Mumbai's skyline.",
  keywords: ["Marina One", "Ashwin Sheth Group", "YM Infra", "Mumbai luxury apartments", "360 panorama", "Mumbai skyline"],
  authors: [{ name: "Ashwin Sheth Group" }],
  openGraph: {
    title: "Marina One | 360° Panoramic Views",
    description: "Experience breathtaking 360° panoramic views from Marina One luxury residences in Mumbai.",
    type: "website",
    siteName: "Marina One Panorama Viewer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
