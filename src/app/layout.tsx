import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans, fontSerif } from "@/config/fonts";
import NavbarWrapper from "@/components/navbar-wrapper";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["todo", "tarefas", "organizador", "produtividade", "agenda", "calendário"],
  authors: [
    {
      name: "Todo App Team",
      url: "https://todoapp.example.com",
    },
  ],
  creator: "Todo App Team",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
  initialScale: 1,
  width: "device-width",
  maximumScale: 2,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="pt-br">
      <head>
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6366f1" />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          "transition-colors duration-300",
          "selection:bg-primary-100 selection:text-primary-900 dark:selection:bg-primary-900 dark:selection:text-primary-200",
          fontSans.variable,
          fontSerif.variable,
        )}
        style={fontSans.style}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "system" }}>
          <div className="relative flex flex-col min-h-screen">
            <NavbarWrapper>
              <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 flex-grow min-h-[calc(100vh-var(--navbar-height)-36px)] w-full">
                <div className="max-w-7xl w-full mx-auto py-4 md:py-6 lg:py-8">
                  {children}
                </div>
              </main>
            </NavbarWrapper>
          </div>
        </Providers>
      </body>
    </html>
  );
}
