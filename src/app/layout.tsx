import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://sdbg.speran.dev";
const SITE_NAME = "Stream Deck GIF Background Slicer";
const SITE_TITLE = "Stream Deck GIF Background Slicer — Free Animated Tiles & Profile Export";
const SITE_DESCRIPTION =
  "Free in-browser tool that turns any GIF into animated tiles for your Elgato Stream Deck and exports a ready-to-import .streamDeckProfile. Supports Stream Deck Mini, MK.2, Plus, Neo, XL, and Corsair Galleon 100 SD. 100% client-side — your GIF never leaves your browser.";
const OG_IMAGE = "/img/new-demo-v2.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Stream Deck GIF Background Slicer",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Stream Deck",
    "Stream Deck GIF",
    "Stream Deck GIF background",
    "Stream Deck animated background",
    "Stream Deck wallpaper",
    "GIF slicer",
    "GIF splitter",
    "GIF tiles",
    "Elgato Stream Deck",
    "Stream Deck Mini",
    "Stream Deck MK.2",
    "Stream Deck Plus",
    "Stream Deck Neo",
    "Stream Deck XL",
    "Corsair Galleon 100 SD",
    ".streamDeckProfile",
    "Stream Deck Profile",
    "animated GIF Stream Deck",
    "GIF to Stream Deck",
    "free Stream Deck tool",
  ],
  authors: [{ name: "Sebastian Sperandio", url: "https://github.com/sebastiansperandio" }],
  creator: "Sebastian Sperandio",
  publisher: "Sebastian Sperandio",
  applicationName: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Stream Deck GIF Background Slicer — Browser interface showing the model picker, drop zone and Stream Deck Profile export",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@sperandev",
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
    google: "1w8wfV_6PHud3vTuYy96NFEzm6hjznP7-D1aS43Bvk8",
  },
  other: {
    "theme-color": "#623198",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  alternateName: "SDBG — Stream Deck Background Generator",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "Stream Deck animated background generator",
  operatingSystem: "Any modern browser (Chrome, Edge, Firefox, Safari)",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Slice any animated GIF into Stream Deck button tiles",
    "Export as ready-to-import .streamDeckProfile file",
    "Supports Stream Deck Mini (2×3, 6 buttons)",
    "Supports Stream Deck MK.2 (3×5, 15 buttons)",
    "Supports Stream Deck Plus and Neo (4×2, 8 buttons)",
    "Supports Stream Deck XL (8×4, 32 buttons)",
    "Supports Corsair Galleon 100 SD (4×3 button grid + integrated screen)",
    "Smart GIF dimension validation",
    "100% client-side processing — your GIF never leaves your browser",
    "Free and open source",
    "No signup, no install, no ads",
  ],
  screenshot: `${SITE_URL}${OG_IMAGE}`,
  author: {
    "@type": "Person",
    name: "Sebastian Sperandio",
    url: "https://github.com/sebastiansperandio",
    sameAs: [
      "https://www.instagram.com/sebastiansperandio/",
      "https://www.linkedin.com/in/sebastian-sperandio/",
      "https://github.com/sebastiansperandio",
      "https://www.youtube.com/@sperandev",
      "https://www.tiktok.com/@sperandev",
    ],
  },
  creator: {
    "@type": "Person",
    name: "Sebastian Sperandio",
  },
  inLanguage: "en",
  datePublished: "2024-01-01",
  license: "https://github.com/sebastiansperandio/Stream-Deck-BG/blob/main/LICENSE",
  potentialAction: {
    "@type": "UseAction",
    target: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
