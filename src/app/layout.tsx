import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import InstallBanner from "@/components/InstallBanner";

export const metadata: Metadata = {
  title: "TMS Pro - Transport Management System",
  description: "Comprehensive transport management system for fleet operations, route optimization, and shipment tracking",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TMS Pro",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TMS Pro",
    title: "TMS Pro - Transport Management System",
    description: "Comprehensive transport management system for fleet operations, route optimization, and shipment tracking",
  },
  twitter: {
    card: "summary",
    title: "TMS Pro - Transport Management System",
    description: "Comprehensive transport management system for fleet operations, route optimization, and shipment tracking",
  },
};

export const viewport: Viewport = { themeColor: "#3b82f6", viewportFit: "cover" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TMS Pro" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className="antialiased"
      >
        <InstallBanner />
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  );
}
