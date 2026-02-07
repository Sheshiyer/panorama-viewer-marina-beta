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
  title: "One Marina | 360° Panoramic Views | Ashwin Sheth Group",
  description: "Experience breathtaking 360° panoramic views from One Marina luxury residences. Explore floors 44F to 75F with dynamic time-of-day views of Mumbai's skyline.",
  keywords: ["One Marina", "Ashwin Sheth Group", "YM Infra", "Mumbai luxury apartments", "360 panorama", "Mumbai skyline"],
  authors: [{ name: "Ashwin Sheth Group" }],
  openGraph: {
    title: "One Marina | 360° Panoramic Views",
    description: "Experience breathtaking 360° panoramic views from One Marina luxury residences in Mumbai.",
    type: "website",
    siteName: "One Marina Panorama Viewer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
