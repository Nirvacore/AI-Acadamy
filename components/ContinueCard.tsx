"use client";

import { useEffect, useMemo, useState } from "react";
import { readDone, PROGRESS_EVENT, TrackedLink } from "@/components/TrackSwitch";

export type PathLesson = {
  id: string;
  slug: string;
  title_th: string;
};

export function ContinueCard({ lessons }: { lessons: PathLesson[] }) {
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
  const finished = done.filter((id) => lessons.some((lesson) => lesson.id === id)).length;

  return (
    <div className="continue-card">
      <p className="eyebrow">บทถัดไปในเครื่องนี้</p>
      {next ? (
        <>
          <h2>{next.title_th}</h2>
          <p>
            เรียนแล้ว {finished} จาก {lessons.length} บท ความคืบหน้าเก็บในเบราว์เซอร์นี้ ไม่ส่งให้เธอ
          </p>
          <TrackedLink className="btn primary" href={`/learn/${next.slug}`}>
            เรียนต่อ
          </TrackedLink>
        </>
      ) : (
        <>
          <h2>ครบวงจรแล้ว</h2>
          <p>ถ้าเทสร้านค้ายังแดง ให้กลับไปโปรเจกต์จบ แล้วตรวจดิฟด้วยตาอีกครั้ง</p>
          <TrackedLink className="btn primary" href="/shop">
            เปิดร้านค้าตัวอย่าง
          </TrackedLink>
        </>
      )}
    </div>
  );
}

export function PathList({ lessons }: { lessons: PathLesson[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  return (
    <ol className="path-list">
      {lessons.map((lesson) => (
        <li key={lesson.id} className={done.includes(lesson.id) ? "is-done" : ""}>
          <TrackedLink href={`/learn/${lesson.slug}`}>
            <span>{done.includes(lesson.id) ? "ผ่าน" : "ยัง"}</span>
            {lesson.title_th}
          </TrackedLink>
        </li>
      ))}
    </ol>
  );
}
