import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Script from 'next/script'
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Pro Headshot Generator",
  description: "Generate your professional headshot instantly.",
  openGraph: {
    images: ["/og-image.png"],
    title: "Pro Headshot Generator",
    description: "Generate your professional headshot instantly.",
    url: "https://proheadshot.vercel.app",
    siteName: "proHeadshot.pics",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
    title: "Pro Headshot Generator",
    description: "Generate your professional headshot instantly.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-black">
        {children}
        <Analytics />
        <Script defer data-domain="proheadshot.pics" src="https://data.lucata.co/js/script.js" />
      </body>
    </html>
  );
}
