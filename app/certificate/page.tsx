import type { Metadata } from "next";
import { Certificate } from "@/components/Certificate";
import { courseHours, portalLessons } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "เกียรติบัตร",
};

export default function CertificatePage() {
  const lessons = portalLessons().map((lesson) => ({
    id: lesson.id,
    title_th: lesson.title_th,
  }));

  return (
    <>
      <header className="lesson-head">
        <p className="kicker">Completion credential · Open Badge spirit</p>
        <h1>เกียรติบัตรผู้ประกอบ</h1>
        <p className="lede">
          ออกในเครื่องนี้เมื่อจบบท ผ่านสอบสั้น และเขียนสมุดครบ ไม่ใช่ปริญญา และไม่ใช่ใบรับรองจากบริษัทเครื่องมือ
        </p>
      </header>
      <Certificate lessonIds={lessons} hours={courseHours()} />
    </>
  );
}
