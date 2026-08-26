import { Suspense } from "react";
import { Dashboard } from "@/components/Dashboard";
import { WeekPlan } from "@/components/WeekPlan";
import { HeroStart } from "@/components/HeroStart";
import { TrackedLink } from "@/components/TrackSwitch";
import { courseHours, portalLessons } from "@/lib/catalog";
import { loadSchema } from "@/lib/curriculum";

export default function HomePage() {
  const schema = loadSchema();
  const lessons = portalLessons();
  const hours = courseHours();

  return (
    <Suspense fallback={null}>
      <HeroStart lessons={lessons} />

      <details className="more-lms">
        <summary>แผนเรียน ผลการเรียน และรายการบททั้งหมด</summary>
        <Dashboard lessons={lessons} hours={hours} />
        <WeekPlan lessons={lessons} />
        <div className="modules">
          {schema.modules.map((module) => (
            <article className="card" key={module.id}>
              <p className="eyebrow">{module.phase === 1 ? "แทร็ก A · พื้นฐาน" : "แทร็ก B · เขียนโค้ด"}</p>
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
            <h2>เทียบเครื่องมือและร้านค้า</h2>
            <p className="lede">ใช้หลังผ่านภาพหลอนแล้ว อย่าเริ่มที่นี่ถ้ายังไม่รู้ว่าเธอคือใคร</p>
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
      </details>
    </Suspense>
  );
}
