import GoogleAnalytics from "@/components/ga";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Theme } from "@radix-ui/themes";
import Header from "@/components/header";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Bundle",
  description: "The Bundle by Grida",
  metadataBase: new URL("https://grida.co/bundle"),
  openGraph: {
    images: "https://grida.co/bundle/og-image.jpg",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"
      // https://github.com/vercel/next.js/discussions/22388
      className="dark" style={{ colorScheme: "dark" }}
    >
      <GoogleAnalytics gaid={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? ''} />
      <body className={inter.className}>
        <Theme
          appearance="dark"
          accentColor="gray"
          radius="small"
          hasBackground={false}
        >
          <Header />
          {children}
        </Theme>
      </body>
    </html>
  );
}
