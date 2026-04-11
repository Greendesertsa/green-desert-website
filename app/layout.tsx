import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { GoogleAnalytics } from "@next/third-parties/google"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greendesert.sa"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Green Desert - Accelerating Saudi Arabia's Transformation Towards A Greener Future",
  description:
    "Green Desert is a biotechnology Saudi Arabian Start Up Company leading ecological impact in Saudi Arabia and the Gulf Countries. Sustainable solutions for environmental challenges.",
  keywords:
    "Green Desert, Saudi Arabia, biotechnology, environmental solutions, sustainability, Vision 2030, hemp products, biomass composting",
  authors: [{ name: "Green Desert" }],
  creator: "Green Desert",
  publisher: "Green Desert",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    url: SITE_URL,
    siteName: "Green Desert",
    title: "Green Desert - Environmental Solutions for Saudi Arabia",
    description:
      "Leading biotechnology company providing sustainable environmental solutions in Saudi Arabia and the Gulf region.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Green Desert - Environmental Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Desert - Environmental Solutions",
    description: "Sustainable biotechnology solutions for Saudi Arabia's environmental challenges.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}/en`,
      "ar-SA": `${SITE_URL}/ar`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `${SITE_URL}/#organization`,
              name: 'Green Desert',
              url: SITE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/og-image.jpg`,
              },
            }),
          }}
        />
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              url: SITE_URL,
              name: 'Green Desert',
              publisher: { '@id': `${SITE_URL}/#organization` },
            }),
          }}
        />
      </head>
      <body className="font-sans overflow-x-hidden">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
      <GoogleAnalytics gaId="G-BHV4YP9XJ8" />
    </html>
  )
}
