import "./globals.css";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Bundle",
  description: "The Bundle by Grida",
  colorScheme: "dark",
  openGraph: {
    images: "https://grida.co/bundle/og-image.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme
          appearance="dark"
          accentColor="gray"
          radius="small"
          hasBackground={false}
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
