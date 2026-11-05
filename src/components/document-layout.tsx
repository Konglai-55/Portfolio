import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "./locale-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource-variable/noto-serif-sc/wght.css";
import "@/app/globals.css";
import { mediaOrigin } from "@/lib/media";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DocumentLayout({
  children, locale = "zh",
}: Readonly<{
  children: React.ReactNode; locale?: Locale;
}>) {
  return (
    <html
      lang={locale === "en" ? "en" : "zh-CN"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <noscript><style>{"[data-opening]{display:none!important}"}</style></noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'document.documentElement.classList.add(window.matchMedia("(max-width: 700px)").matches?"opening-seen":"hero-intro-pending");try{if(sessionStorage.getItem("lx-opening-seen"))document.documentElement.classList.add("opening-seen")}catch(e){}',
          }}
        />
        <link rel="dns-prefetch" href={mediaOrigin} />
        <link rel="preconnect" href={mediaOrigin} crossOrigin="anonymous" />
      </head>
      <body className="min-h-full"><LocaleProvider locale={locale}>{children}</LocaleProvider></body>
    </html>
  );
}
