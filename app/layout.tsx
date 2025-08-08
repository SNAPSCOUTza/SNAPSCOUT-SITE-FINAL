import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Header from "@/components/layout/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "SnapScout - Your Local Creative Companion",
    template: "%s | SnapScout"
  },
  description: "Connect, Create, and Get Booked in South Africa's Premier Creative Network. Find photographers, videographers, studios, and equipment rental services.",
  keywords: [
    "photography",
    "videography", 
    "creative services",
    "South Africa",
    "film crew",
    "studios",
    "equipment rental",
    "photographers",
    "videographers"
  ],
  authors: [{ name: "SnapScout Team" }],
  creator: "SnapScout",
  publisher: "SnapScout",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://snapscout.co.za"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://snapscout.co.za",
    title: "SnapScout - Your Local Creative Companion",
    description: "Connect, Create, and Get Booked in South Africa's Premier Creative Network",
    siteName: "SnapScout",
    images: [
      {
        url: "/images/snapscout-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SnapScout - Creative Network Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapScout - Your Local Creative Companion",
    description: "Connect, Create, and Get Booked in South Africa's Premier Creative Network",
    images: ["/images/snapscout-twitter-image.jpg"],
    creator: "@snapscout_za",
  },
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
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
