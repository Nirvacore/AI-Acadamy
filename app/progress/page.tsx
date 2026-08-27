import type { Metadata } from "next";
import { Gradebook } from "@/components/Gradebook";
import { ProgressSync } from "@/components/ProgressSync";
import { checksFor } from "@/lib/checks";
import { portalLessons } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "ผลการเรียน",
};

export default function ProgressPage() {
  const rows = portalLessons().map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title_th: lesson.title_th,
    checkTotal: Math.max(checksFor(lesson.id).length, 1),
  }));

  return (
    <>
      <header className="lesson-head">
        <p className="kicker">Gradebook · Canvas-style</p>
        <h1>ผลการเรียนในเครื่องนี้</h1>
        <p className="lede">
          รวมบทที่จบ สอบสั้น และสมุดสะท้อน เป็นคะแนนประเมินตนเอง ไม่ส่งไปสำนักทะเบียนใด
        </p>
      </header>
      <Gradebook rows={rows} />
      <ProgressSync />
    </>
  );
}
