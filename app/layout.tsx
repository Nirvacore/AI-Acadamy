import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SideNav } from "@/components/Shell";
import { TrackSwitch } from "@/components/TrackSwitch";
import { CommandPalette } from "@/components/CommandPalette";
import { RailProgress } from "@/components/RailProgress";
import { StudioBar } from "@/components/StudioBar";
import { SWRegister } from "@/components/SWRegister";
import { allLessons, loadSchema } from "@/lib/curriculum";
import { buildCatalog } from "@/lib/catalog";
import "./globals.css";

const site = "https://study.nirva.one";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Nirva Academy",
    template: "%s · Nirva Academy",
  },
  description: "เรียนเอเจนต์เป็นไทย แล้วเห็นตนเองผ่านกระจกมหาสูญตา",
  alternates: { canonical: "/" },
  applicationName: "Nirva Academy",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#c4a15a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = loadSchema();
  const catalog = buildCatalog();
  const total = allLessons().length;

  return (
    <html lang="th">
      <body>
        <a className="skip-link" href="#main">
          ข้ามไปเนื้อหา
        </a>
        <div className="frame">
          <aside className="rail">
            <Link className="brand" href="/">
              Nirva Academy
              <small>มหาสูญตา · เอเจนต์</small>
            </Link>
            <details className="rail-fold" open>
              <summary>เมนูเรียน</summary>
              <Suspense fallback={null}>
                <CommandPalette catalog={catalog} />
                <TrackSwitch />
                <RailProgress total={total} />
                <SideNav modules={schema.modules} />
              </Suspense>
            </details>
          </aside>
          <main id="main" className="stage">
            {children}
          </main>
        </div>
        <Suspense fallback={null}>
          <StudioBar />
        </Suspense>
        <SWRegister />
      </body>
    </html>
  );
}
