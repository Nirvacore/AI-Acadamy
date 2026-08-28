"use client";

import { useEffect, useMemo, useState } from "react";
import { PathList, type PathLesson } from "@/components/ContinueCard";
import { TrackedLink } from "@/components/TrackSwitch";
import { PROGRESS_EVENT, readDone } from "@/lib/progress";

export function HeroStart({ lessons }: { lessons: PathLesson[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const next = useMemo(
    () => lessons.find((lesson) => !done.includes(lesson.id)),
    [done, lessons],
  );
  const started = done.some((id) => lessons.some((lesson) => lesson.id === id));
  const finished = done.filter((id) => lessons.some((lesson) => lesson.id === id)).length;

  return (
    <section className="start-hero">
      <p className="eyebrow">พร้อมเรียนทันที</p>
      <h1>นั่งลงแล้วเริ่มได้เลย</h1>
      <p className="lede">
        คอร์สนี้สอนให้ใช้เอเจนต์เป็นเครื่องมือ แล้วเห็นนิสัยของตนเองชัดขึ้น คำว่า{" "}
        <strong>เธอ</strong> หมายถึงเอเจนต์ที่นั่งข้างๆ ไม่ใช่คน กดปุ่มเดียว
        นั่งแรกจะบอกทุกอย่างที่ต้องทำในสิบห้านาที
      </p>
      <ol className="three-rules">
        <li>
          <strong>เธอไม่มีจิต</strong> เธอเดาคำในลูป คนคิด คนตรวจ คนรับผิดชอบ
        </li>
        <li>
          <strong>เรียนทีละบท</strong> อย่าข้ามภาพหลอน มิฉะนั้นจะเชื่อคำที่ไม่มีของจริง
        </li>
        <li>
          <strong>สมุดคิดเอง</strong> ข้อสอบและจดสะท้อนห้ามวางให้เธอเขียนแทน
        </li>
      </ol>
      <div className="actions">
        {started && next ? (
          <>
            <TrackedLink className="btn huge" href={`/learn/${next.slug}`}>
              เรียนต่อ · {next.title_th}
            </TrackedLink>
            <TrackedLink className="btn ghost" href="/start">
              ทบทวนชั่วโมงแรก
            </TrackedLink>
          </>
        ) : next ? (
          <>
            <TrackedLink className="btn huge" href="/start">
              เริ่มเรียนบทแรก
            </TrackedLink>
            <TrackedLink className="btn ghost" href="/learn/mirror">
              ข้ามไปบทกระจก
            </TrackedLink>
          </>
        ) : (
          <>
            <TrackedLink className="btn huge" href="/shop">
              เปิดร้านค้าตัวอย่าง
            </TrackedLink>
            <TrackedLink className="btn ghost" href="/media">
              Nirva Media Lab
            </TrackedLink>
            <TrackedLink className="btn ghost" href="/certificate">
              เกียรติบัตร
            </TrackedLink>
          </>
        )}
      </div>
      <p className="save-hint">
        {started
          ? `ในเครื่องนี้เรียนแล้ว ${finished} จาก ${lessons.length} บท ความคืบหน้าไม่ถูกส่งไปไหน`
          : "ความคืบหน้าอยู่ที่เบราว์เซอร์นี้ ไม่ต้องสมัคร ไม่ส่งให้เธอ"}
      </p>
      <div className="home-path">
        <p className="eyebrow">ลำดับที่ต้องเดิน</p>
        <PathList lessons={lessons} />
      </div>
    </section>
  );
}
