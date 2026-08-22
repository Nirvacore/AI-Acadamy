"use client";

import { usePathname } from "next/navigation";
import type { CourseModule, LessonRef, Track, TrackConcept } from "@/lib/curriculum";
import { DoneDot, TrackedLink } from "@/components/TrackSwitch";

export function SideNav({
  modules,
}: {
  modules: CourseModule[];
}) {
  const current = usePathname().split("/").pop();

  return (
    <nav className="side-nav" aria-label="บทเรียน">
      {modules.map((module) => (
        <section key={module.id}>
          <h2>{module.name}</h2>
          <ol>
            {module.lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <TrackedLink
                  className={lesson.slug === current ? "is-on" : ""}
                  href={`/learn/${lesson.slug}`}
                >
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="label">{lesson.title_th}</span>
                  <DoneDot id={lesson.id} />
                </TrackedLink>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <section>
        <h2>อื่นๆ</h2>
        <ul className="plain">
          <li>
            <TrackedLink href="/glossary">อภิธานศัพท์</TrackedLink>
          </li>
          <li>
            <TrackedLink href="/shop">ร้านค้าตัวอย่าง</TrackedLink>
          </li>
        </ul>
      </section>
    </nav>
  );
}

export function AdapterPanel({
  track,
  concept,
  lesson,
}: {
  track: Track;
  concept?: TrackConcept;
  lesson: LessonRef;
}) {
  if (!concept) {
    return (
      <aside className="adapter">
        <p className="eyebrow">{track.name}</p>
        <h2>ชั้นกระจก</h2>
        <p>บทนี้ไม่มีปุ่มเฉพาะบริษัท ใช้มือตนเองก่อน แล้วค่อยเข้าบทเครื่องมือ</p>
      </aside>
    );
  }

  return (
    <aside className="adapter">
      <p className="eyebrow">แทร็ก {track.name}</p>
      <h2>ของเธอในรอบนี้</h2>
      <dl>
        <div>
          <dt>ที่ต้องเปิด</dt>
          <dd>{concept.uiLabel}</dd>
        </div>
        {concept.shortcut ? (
          <div>
            <dt>ทางลัด</dt>
            <dd>
              <kbd>{concept.shortcut}</kbd>
            </dd>
          </div>
        ) : null}
        <div>
          <dt>ขั้นตอนที่ต่าง</dt>
          <dd>{concept.labDelta ?? "ใช้โจทย์ร่วมของบทนี้"}</dd>
        </div>
      </dl>
      <p className="docs">
        <a href={concept.docsUrl} target="_blank" rel="noreferrer">
          เอกสาร {track.name}
        </a>
      </p>
      {lesson.lab ? (
        <p className="docs">
          <TrackedLink href={`/lab/${lesson.lab.split("/").pop()?.replace(/\.md$/, "")}`}>
            เปิดแล็บของบทนี้
          </TrackedLink>
        </p>
      ) : null}
    </aside>
  );
}
