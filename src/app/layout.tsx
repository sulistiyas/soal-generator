import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { siteConfig, getSiteUrl } from "@/lib/site-config";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: baseUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@teachertools",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org Structured Data (JSON-LD) untuk Google Search Rich Snippet
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "id-ID",
        publisher: {
          "@type": "Person",
          name: siteConfig.creator,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        name: siteConfig.name,
        url: baseUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
        },
        description: siteConfig.description,
        featureList: [
          "Generator Naskah Soal Ujian AI Multi-Format (Pilihan Ganda, Essay, Isian, Benar-Salah)",
          "Penyusunan Kisi-Kisi & Rubrik Asesmen Pembelajaran",
          "Dukungan Kurikulum Merdeka & Kurikulum 2013",
          "Ekspor Langsung ke Dokumen Microsoft Word (.docx)",
          "Tingkat Kognitif LOTS, MOTS, dan HOTS (Taksonomi Bloom)",
        ],
        author: {
          "@type": "Person",
          name: siteConfig.creator,
          url: siteConfig.author.url,
        },
      },
    ],
  };

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        {/* JSON-LD Structured Data untuk Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50"
      >
        <GoogleAnalytics />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
