"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { CourseModule, LessonRef, Track } from "@/lib/curriculum";
import { OriginalSources } from "@/components/OriginalSources";
import { DoneDot, TrackedLink, useTrackId } from "@/components/TrackSwitch";

export function SideNav({
  modules,
}: {
  modules: CourseModule[];
}) {
  const current = usePathname().replace(/\/$/, "").split("/").pop();

  return (
    <nav className="side-nav" aria-label="บทเรียน">
      <section>
        <h2>เริ่มเรียน</h2>
        <ul className="plain">
          <li>
            <TrackedLink className={current === "" ? "is-on" : ""} href="/">
              ศูนย์การเรียนรู้
            </TrackedLink>
          </li>
          <li>
            <TrackedLink className={current === "start" ? "is-on" : ""} href="/start">
              ชั่วโมงแรก
            </TrackedLink>
          </li>
          <li>
            <TrackedLink className={current === "profile" ? "is-on" : ""} href="/profile">
              ปรับวิธีเรียน
            </TrackedLink>
          </li>
          <li>
            <TrackedLink className={current === "openai" ? "is-on" : ""} href="/tracks/openai">
              แทร็ก OpenAI
            </TrackedLink>
          </li>
        </ul>
      </section>
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
        <h2>ฝึกปฏิบัติ</h2>
        <ul className="plain">
          <li>
            <TrackedLink href="/shop">ร้านค้าตัวอย่าง</TrackedLink>
          </li>
          <li>
            <TrackedLink href="/journal">สมุดสะท้อน</TrackedLink>
          </li>
        </ul>
      </section>
      <section>
        <h2>สำรวจความรู้</h2>
        <ul className="plain">
          <li>
            <TrackedLink href="/syllabus">หลักสูตร</TrackedLink>
          </li>
          <li>
            <TrackedLink href="/tracks">เทียบแทร็ก</TrackedLink>
          </li>
          <li>
            <TrackedLink href="/glossary">อภิธาน / บัตรคำ</TrackedLink>
          </li>
        </ul>
      </section>
      <section>
        <h2>ความก้าวหน้า</h2>
        <ul className="plain">
          <li>
            <TrackedLink href="/progress">ผลการเรียน</TrackedLink>
          </li>
          <li>
            <TrackedLink href="/certificate">เกียรติบัตร</TrackedLink>
          </li>
        </ul>
      </section>
      <section>
        <h2>กรณีศึกษา</h2>
        <ul className="plain">
          <li>
            <TrackedLink className={current === "media" ? "is-on" : ""} href="/media">
              Nirva Media · งานสื่อ
            </TrackedLink>
          </li>
        </ul>
      </section>
    </nav>
  );
}

function AdapterInner({ tracks, lesson }: { tracks: Track[]; lesson: LessonRef }) {
  const trackId = useTrackId();
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const concept = track.concepts.find((item) => item.conceptId === lesson.id);

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
      <OriginalSources
        track={track}
        concept={concept}
        labHref={lesson.lab ? `/lab/${lesson.lab.split("/").pop()?.replace(/\.md$/, "")}` : undefined}
      />
    </aside>
  );
}

export function AdapterPanel({ tracks, lesson }: { tracks: Track[]; lesson: LessonRef }) {
  return (
    <Suspense fallback={null}>
      <AdapterInner tracks={tracks} lesson={lesson} />
    </Suspense>
  );
}
