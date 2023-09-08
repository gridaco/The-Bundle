import "./globals.css";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import Script from "next/script";

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
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WESLP8N7KE"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-WESLP8N7KE');
        `}
      </Script>
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
