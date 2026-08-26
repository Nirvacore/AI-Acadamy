import { Suspense } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Onboarding } from "@/components/Onboarding";
import { WeekPlan } from "@/components/WeekPlan";
import { TrackedLink } from "@/components/TrackSwitch";
import { courseHours, portalLessons } from "@/lib/catalog";
import { loadSchema } from "@/lib/curriculum";

export default function HomePage() {
  const schema = loadSchema();
  const lessons = portalLessons();
  const hours = courseHours();

  return (
    <Suspense fallback={null}>
      <div className="hero">
        <p className="eyebrow">พอร์ทัลเรียน · เท่าทันมหาวิทยาลัยทั่วโลก</p>
        <h1>{schema.course.tagline}</h1>
        <p>
          ระบบนี้อะแดปต์จาก LMS แบบ Canvas, แผนเรียนแบบ Coursera/edX, การทบทวนแบบ Anki,
          และช่องค้นหาแบบ Cursor กด <kbd>⌘K</kbd> เพื่อกระโดดไปบท แล็บ หรือศัพท์
          ความคืบหน้าอยู่ที่เบราว์เซอร์นี้ ไม่ส่งให้เธอ
        </p>
        <div className="actions">
          <TrackedLink className="btn ghost" href="/syllabus">
            อ่านหลักสูตร
          </TrackedLink>
          <TrackedLink className="btn ghost" href="/progress">
            ผลการเรียน
          </TrackedLink>
        </div>
      </div>

      <Onboarding />
      <Dashboard lessons={lessons} hours={hours} />
      <WeekPlan lessons={lessons} />

      <div className="modules">
        {schema.modules.map((module) => (
          <article className="card" key={module.id}>
            <p className="eyebrow">แทร็ก {module.phase === 1 ? "A" : "B"}</p>
            <h2>{module.name}</h2>
            <ol>
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <TrackedLink href={`/learn/${lesson.slug}`}>{lesson.title_th}</TrackedLink>
                </li>
              ))}
            </ol>
          </article>
        ))}
        <article className="card">
          <p className="eyebrow">ของจริง</p>
          <h2>สตูดิโอและหลักฐาน</h2>
          <p className="lede">เทียบปุ่มแต่ละบริษัท รันเทสร้านค้า แล้วถือข้อมูลเรียนไปเครื่องอื่นได้</p>
          <div className="actions">
            <TrackedLink className="btn primary" href="/tracks">
              เทียบแทร็กบริษัท
            </TrackedLink>
            <TrackedLink className="btn ghost" href="/shop">
              ร้านค้าตัวอย่าง
            </TrackedLink>
          </div>
        </article>
      </div>
    </Suspense>
  );
}
