"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortalLesson } from "@/components/Dashboard";
import { TrackedLink } from "@/components/TrackSwitch";
import { PROGRESS_EVENT, readDone } from "@/lib/progress";

const hubs = [
  {
    eyebrow: "เริ่มจากแก่น",
    title: "เส้นทางเรียน",
    description: "เดินจากความเข้าใจโมเดล ไปสู่การใช้เอเจนต์ทำงานจริงทีละขั้น",
    href: "/start",
    action: "ดูเส้นทางของฉัน",
  },
  {
    eyebrow: "ลงมือแล้วค่อยเชื่อ",
    title: "ฝึกปฏิบัติ",
    description: "ทำแล็บสั้น เปิดหลักฐาน และให้คนตรวจงานก่อนนับว่าผ่าน",
    href: "/lab/00-mirror-journal",
    action: "เปิดแล็บแรก",
  },
  {
    eyebrow: "ค้นตามสิ่งที่อยากรู้",
    title: "สำรวจความรู้",
    description: "เปิดหลักสูตร เทียบเครื่องมือ และย้อนดูคำศัพท์โดยไม่ต้องเรียนเรียงเสมอไป",
    href: "/syllabus",
    action: "สำรวจคลังความรู้",
  },
  {
    eyebrow: "เห็นสิ่งที่ทำได้จริง",
    title: "ความก้าวหน้า",
    description: "ดูบทที่เรียน แบบตรวจ สมุดสะท้อน และหลักฐานที่ยังต้องทำให้ครบ",
    href: "/progress",
    action: "ดูความก้าวหน้า",
  },
] as const;

export function LearningCenterHome({ lessons }: { lessons: PortalLesson[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const lessonIds = useMemo(() => new Set(lessons.map((lesson) => lesson.id)), [lessons]);
  const finished = done.filter((id) => lessonIds.has(id)).length;
  const next = lessons.find((lesson) => !done.includes(lesson.id));
  const started = finished > 0;
  const complete = lessons.length > 0 && finished === lessons.length;
  const continueHref = complete ? "/progress" : started && next ? `/learn/${next.slug}` : "/start";
  const continueLabel = complete
    ? "ทบทวนผลการเรียน"
    : started && next
      ? `เรียนต่อ · ${next.title_th}`
      : "เริ่มนั่งแรก 15 นาที";

  return (
    <section className="learning-center" aria-labelledby="learning-center-title">
      <header className="learning-center-hero">
        <div>
          <p className="eyebrow">Nirva Academy · ศูนย์การเรียนรู้</p>
          <h1 id="learning-center-title">เรียน AI เป็นภาษาไทย แล้วนำไปใช้กับงานจริง</h1>
          <p className="lede">
            เลือกทางที่เหมาะกับวันนี้ เรียนทีละช่วงสั้น ทำของจริง และเปิดหลักฐานก่อนเชื่อคำตอบของเอเจนต์
          </p>
        </div>

        <aside className="next-step" aria-label="ขั้นถัดไปของฉัน">
          <p className="eyebrow">ขั้นถัดไปของฉัน</p>
          <strong>{complete ? "เรียนครบเส้นทางปัจจุบันแล้ว" : next?.title_th ?? "ชั่วโมงแรก"}</strong>
          <span>
            {started
              ? `เครื่องนี้บันทึกแล้ว ${finished} จาก ${lessons.length} บท`
              : "เริ่มได้ทันที ไม่ต้องสมัครบัญชี"}
          </span>
          <TrackedLink className="btn primary" href={continueHref}>
            {continueLabel}
          </TrackedLink>
          <TrackedLink className="profile-link" href="/profile">
            ปรับวิธีเรียนของฉัน
          </TrackedLink>
          <small>ความก้าวหน้าอยู่ในเบราว์เซอร์นี้ และยังไม่ถูกส่งไปให้ AI</small>
        </aside>
      </header>

      <nav className="learning-hubs" aria-label="เลือกพื้นที่เรียนรู้">
        {hubs.map((hub, index) => (
          <TrackedLink className="learning-hub" href={hub.href} key={hub.title}>
            <span className="hub-index">0{index + 1}</span>
            <span className="eyebrow">{hub.eyebrow}</span>
            <strong>{hub.title}</strong>
            <span className="hub-description">{hub.description}</span>
            <span className="hub-action">{hub.action} →</span>
          </TrackedLink>
        ))}
      </nav>

      <aside className="product-boundary" aria-label="ขอบเขตผลิตภัณฑ์">
        <div>
          <p className="eyebrow">เรียนในที่เดียว แต่ไม่ปนผลิตภัณฑ์</p>
          <h2>Nirva Academy คือพื้นที่เรียน</h2>
          <p>
            Nirva Media เป็นกรณีศึกษาสำหรับฝึกงานสื่อ ส่วน Nirva AI เป็นระบบอีกผลิตภัณฑ์หนึ่ง
            ที่อาจนำความรู้นี้ไปใช้ งานในกรณีศึกษาจะไม่เผยแพร่จริงจนกว่าคนจะตรวจและอนุมัติ
          </p>
        </div>
        <TrackedLink className="btn ghost" href="/media">
          เปิดกรณีศึกษา Nirva Media
        </TrackedLink>
      </aside>
    </section>
  );
}
