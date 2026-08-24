import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SideNav } from "@/components/Shell";
import { TrackSwitch } from "@/components/TrackSwitch";
import { loadSchema } from "@/lib/curriculum";
import "./globals.css";

const site = process.env.BASE_PATH
  ? `https://nirvacore.github.io${process.env.BASE_PATH}`
  : "https://study.nirva.one";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "AI-Acadamy",
  description: "เรียนเอเจนต์เป็นไทย แล้วเห็นตนเองผ่านกระจกมหาสูญตา",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = loadSchema();

  return (
    <html lang="th">
      <body>
        <div className="frame">
          <aside className="rail">
            <Link className="brand" href="/">
              AI-Acadamy
              <small>มหาสูญตา · เอเจนต์</small>
            </Link>
            <Suspense fallback={null}>
              <TrackSwitch />
              <SideNav modules={schema.modules} />
            </Suspense>
          </aside>
          <main className="stage">{children}</main>
        </div>
      </body>
    </html>
  );
}
