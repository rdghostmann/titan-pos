import { Geist, Geist_Mono, Manrope } from "next/font/google"
import type { Metadata } from "next";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "TitanPOS",
    template: "%s | TitanPOS",
  },  description: "Multi-Purpose POS Management System",

   icons: {
    icon: [
      {
        url: "/logo-favicon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],

    shortcut: "/logo-favicon.png",

    apple: "/logo-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", manrope.variable)}
    >
       <body cz-shortcut-listen="true">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            <TooltipProvider>
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
              <Toaster />
            </TooltipProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
