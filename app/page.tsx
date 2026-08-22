import { Suspense } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import { loadSchema } from "@/lib/curriculum";

export default function HomePage() {
  const schema = loadSchema();

  return (
    <Suspense fallback={null}>
      <div className="hero">
        <p className="eyebrow">พร้อมลองใช้</p>
        <h1>{schema.course.tagline}</h1>
        <p>
          เลือกแทร็กบริษัทด้านซ้าย แล้วเริ่มที่กระจก บทเทคนิคยังอิง Cursor Learn
          แต่เขียนใหม่เป็นไทย ของจริงสำหรับลงมืออยู่ที่ร้านค้าตัวอย่าง
        </p>
        <div className="actions">
          <TrackedLink className="btn primary" href="/learn/mirror">
            เริ่มที่กระจก
          </TrackedLink>
          <TrackedLink className="btn ghost" href="/shop">
            เปิดร้านค้าตัวอย่าง
          </TrackedLink>
        </div>
      </div>

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
          <h2>วิธีลองในเครื่อง</h2>
          <p className="lede">
            เปิดเว็บนี้แล้วเรียนไปตามบท จากรากโปรเจกต์รันเทสร้านค้าได้เลย เทสแดงตอนแรกเป็นจุดตั้งต้น
          </p>
          <pre>
            <code>{`npm install
npm run dev
npm run test:shop`}</code>
          </pre>
        </article>
      </div>
    </Suspense>
  );
}
