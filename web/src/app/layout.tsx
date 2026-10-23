import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import ServiceWorkerRegistration from "@/components/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Boca Players | Plantel",
    template: "%s | Boca Players",
  },
  description:
    "Explora perfiles de jugadores de Boca Juniors, sus posiciones y nacionalidades.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#082d70",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <ServiceWorkerRegistration />
        <SiteHeader />
        {children}
        <footer className="site-footer" id="acerca-de">
          <div className="footer-inner">
            <Link className="brand footer-brand" href="/">
              Boca Players
            </Link>
            <p>
              Proyecto educativo independiente. Los datos del plantel son de
              ejemplo y deben verificarse.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
