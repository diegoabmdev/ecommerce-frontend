// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Suspense } from "react";
import Footer from "@/components/footer/Footer";
import { ScrollToTop } from "@/components/footer/ScrollToTop";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaCart – Tu tienda moderna",
  description:
    "Proyecto portafolio e-commerce con Next.js, Zustand y DummyJSON",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="relative flex min-h-screen flex-col">
                <Suspense
                  fallback={<div className="h-20 w-full bg-background" />}
                >
                  <Navbar />
                </Suspense>

                <main className="flex-1">
                  <Suspense fallback={null}>{children}</Suspense>
                </main>

                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
        <ScrollToTop />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
