import { Suspense } from "react";
import { ContinueCard } from "@/components/ContinueCard";
import { TrackedLink } from "@/components/TrackSwitch";
import { allLessons, loadSchema } from "@/lib/curriculum";

export default function HomePage() {
  const schema = loadSchema();
  const lessons = allLessons().map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title_th: lesson.title_th,
  }));

  return (
    <Suspense fallback={null}>
      <div className="hero">
        <p className="eyebrow">พร้อมเรียนต่อ</p>
        <h1>{schema.course.tagline}</h1>
        <p>
          เลือกแทร็กบริษัทด้านซ้าย แล้วเดินจากกระจกสู่ร้านค้าตัวอย่าง บทเทคนิคอิง Cursor Learn
          แต่เขียนใหม่เป็นไทย ความคืบหน้าและสมุดสะท้อนอยู่แค่ในเบราว์เซอร์นี้
        </p>
      </div>

      <ContinueCard lessons={lessons} />

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
          <h2>เทียบแทร็กและร้านค้า</h2>
          <p className="lede">ดูปุ่มของแต่ละบริษัทในหน้าเดียว แล้วรันเทสจากไฟล์ราคาจริง</p>
          <div className="actions">
            <TrackedLink className="btn primary" href="/tracks">
              เทียบแทร็กบริษัท
            </TrackedLink>
            <TrackedLink className="btn ghost" href="/shop">
              เปิดร้านค้าตัวอย่าง
            </TrackedLink>
          </div>
        </article>
      </div>
    </Suspense>
  );
}
