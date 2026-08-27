import type { Metadata } from "next";
import { TrackedLink } from "@/components/TrackSwitch";
import { ProgressSync } from "@/components/ProgressSync";
import { courseHours, portalLessons } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "หลักสูตร",
  description: "ผลลัพธ์ ชั่วโมง เกณฑ์ประเมิน และจรรยาบรรณของ Nirva Academy",
};

export default function SyllabusPage() {
  const lessons = portalLessons();
  const hours = courseHours();

  return (
    <>
      <header className="lesson-head">
        <p className="kicker">Syllabus · อะแดปต์จากมหาวิทยาลัยที่ใช้เทคโนโลยีการเรียนร่วมสมัย</p>
        <h1>หลักสูตร Nirva Academy</h1>
        <p className="lede">
          หนึ่งหน่วยกิตแนะนำ · ประมาณ {hours} ชั่วโมง รวมอ่าน แล็บ สอบสั้น และสมุดสะท้อน
          เนื้อหาต้นฉบับไทย อิงโครง Cursor Learn โดยไม่คัดลอกบทอังกฤษ
        </p>
      </header>

      <section className="prose">
        <h2>ผลลัพธ์เมื่อจบคอร์ส</h2>
        <ul>
          <li>เลือกโมเดลและขอบเขตงานจากราคาของความผิดพลาด ไม่ใช่จากโลโก้</li>
          <li>จับภาพหลอนด้วยหลักฐาน เปิดพาธ เทส และดิฟก่อนยอมรับ</li>
          <li>ตัดคอนเท็กซ์ เรียกเครื่องมือ และมอบหมายงานเล็กในลูปเอเจนต์</li>
          <li>สลับแทร็ก Cursor / Claude / OpenAI / Copilot โดยไม่เรียนแนวคิดใหม่</li>
          <li>ใช้เธอเป็นกระจก เห็นจิตตนเอง โดยไม่ให้จิตแก่เครื่องมือ</li>
        </ul>
        <h2>โครงสร้าง</h2>
        <p>
          แทร็ก A คือพื้นฐาน AI เจ็ดบท แทร็ก B คือเอเจนต์เขียนโค้ดเจ็ดบท รวมโปรเจกต์จบบนร้านค้าตัวอย่าง
          แต่ละบทมีเป้าหมาย ชั้นกระจก เดโม แล็บ สอบสั้น และสมุดสะท้อน
        </p>
        <h2>เกณฑ์ประเมิน (ประเมินตนเอง)</h2>
        <ul>
          <li>ร้อยละ ๔๐ แล็บและเทสร้านค้าที่ตรวจได้</li>
          <li>ร้อยละ ๓๐ สอบสั้นท้ายบท คิดเองในเบราว์เซอร์</li>
          <li>ร้อยละ ๓๐ สมุดสะท้อนที่เขียนด้วยมือตนเอง</li>
        </ul>
        <p>
          นี่ไม่ใช่เกรดในสำนักทะเบียน เป็นสัดส่วนแบบมหาวิทยาลัยเพื่อให้รู้ว่าอะไรยังขาด
        </p>
        <h2>จรรยาบรรณ</h2>
        <p>
          ใช้เธอช่วยสำรวจและเขียนโค้ดได้ ตามขอบของแล็บ ห้ามให้เธอเขียนสมุดสะท้อนหรือตอบสอบสั้นแทน
          ของแถมในดิฟไม่ยอมรับ หลักฐานต้องเปิดตามได้
        </p>
        <h2>แผนเวลา</h2>
        <ul>
          <li>เข้มข้น ๗ วัน — วันละประมาณสองบท</li>
          <li>ภาคค่ำ ๔ สัปดาห์ — สัปดาห์ละสามถึงสี่บท</li>
        </ul>
        <p>
          กด <kbd>⌘K</kbd> เพื่อค้นทั้งหลักสูตร ติดตั้งเป็นแอปได้จากเบราว์เซอร์ (PWA)
          และส่งออก JSON เพื่อย้ายเครื่อง
        </p>
      </section>

      <ol className="syllabus-list">
        {lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <span className="num">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <TrackedLink href={`/learn/${lesson.slug}`}>{lesson.title_th}</TrackedLink>
              <p>
                {lesson.moduleName} · {lesson.minutes} นาที
              </p>
              {lesson.outcome ? <p className="lede">{lesson.outcome}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <ProgressSync />
    </>
  );
}
