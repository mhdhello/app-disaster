import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { StructuredData } from "@/components/structured-data"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://app-disaster.vercel.app"),
  title: {
    default: "RiseAgain Sri Lanka | Emergency Response System",
    template: "%s | Sri Lanka Flood Relief",
  },
  description:
    "Official emergency response portal for Sri Lanka flood disaster relief. Report flood damage, offer help, and coordinate relief efforts. Connect affected communities with donors and volunteers.",
  keywords: [
    "Sri Lanka flood relief",
    "emergency response",
    "disaster relief",
    "flood damage report",
    "donate Sri Lanka",
    "emergency assistance",
    "flood victims",
    "disaster management",
    "humanitarian aid",
    "Sri Lanka emergency",
    "flood support",
    "relief coordination",
  ],
  authors: [{ name: "Sri Lanka Flood Relief Team" }],
  creator: "RiseAgain Sri Lanka",
  publisher: "RiseAgain Sri Lanka",
  generator: "Next.js",
  applicationName: "RiseAgain Sri Lanka",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app-disaster.vercel.app",
    siteName: "RiseAgain Sri Lanka",
    title: "RiseAgain Sri Lanka | Emergency Response System",
    description:
      "Official emergency response portal for Sri Lanka flood disaster relief. Report flood damage, offer help, and coordinate relief efforts. Connect affected communities with donors and volunteers.",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "RiseAgain Sri Lanka - Emergency Response System",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RiseAgain Sri Lanka | Emergency Response System",
    description:
      "Official emergency response portal for Sri Lanka flood disaster relief. Report damage or offer help.",
    images: [
      {
        url: "/Logo.png",
        alt: "RiseAgain Sri Lanka - Emergency Response System",
      },
    ],
    creator: "@srilankafloodrelief",
    site: "@srilankafloodrelief",
  },
  alternates: {
    canonical: "https://app-disaster.vercel.app",
  },
  category: "Emergency Services",
  classification: "Public Service",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flood Relief",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  other: {
    "geo.region": "LK",
    "geo.placename": "Sri Lanka",
    "geo.position": "7.8731;80.7718",
    "ICBM": "7.8731, 80.7718",
    "contact": "119",
    "emergency": "119",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0f1a" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
  colorScheme: "dark light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} font-sans antialiased`}
        suppressHydrationWarning
      >
        <StructuredData />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
