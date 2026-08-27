"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PROGRESS_EVENT,
  journalFilled,
  readChecks,
  readDone,
  readName,
  writeName,
} from "@/lib/progress";

export function Certificate({
  lessonIds,
  hours,
}: {
  lessonIds: { id: string; title_th: string }[];
  hours: number;
}) {
  const [done, setDone] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [journals, setJournals] = useState(0);

  useEffect(() => {
    const sync = () => {
      setDone(readDone());
      setChecks(readChecks());
      setName(readName());
      setJournals(lessonIds.filter((lesson) => journalFilled(lesson.id)).length);
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [lessonIds]);

  const finished = lessonIds.filter((lesson) => done.includes(lesson.id)).length;
  const checkPassed = lessonIds.filter((lesson) => (checks[lesson.id] ?? 0) >= 1).length;
  const complete = finished === lessonIds.length && checkPassed === lessonIds.length;

  const date = useMemo(() => new Date().toLocaleDateString("th-TH"), []);

  return (
    <div className="cert-wrap">
      <label className="cert-name">
        ชื่อบนเกียรติบัตร (เก็บในเครื่องนี้)
        <input
          value={name}
          onChange={(event) => {
            const value = event.target.value;
            setName(value);
            writeName(value);
          }}
        />
      </label>
      <p className="lede">
        จบบท {finished}/{lessonIds.length} · แบบตรวจ {checkPassed}/{lessonIds.length} · สมุด{" "}
        {journals}/{lessonIds.length}
      </p>
      {!complete ? (
        <p className="gate">
          เกียรติบัตรนี้ไม่ใช่ปริญญา ออกได้เมื่อทำเครื่องหมายครบและผ่านสอบสั้นทุกบท สมุดสะท้อนเป็นจรรยาบรรณ ให้เขียนเอง
        </p>
      ) : null}
      <article className={complete ? "certificate is-ready" : "certificate"}>
        <p className="eyebrow">Nirva Academy · มหาสูญตา</p>
        <h1>เกียรติบัตรผู้ประกอบ</h1>
        <p className="cert-who">{name.trim() || "ผู้เรียนในเบราว์เซอร์นี้"}</p>
        <p>
          ได้เดินหลักสูตรเอเจนต์ต้นฉบับไทยครบ {lessonIds.length} บท ประมาณ {hours} ชั่วโมง
          ตรวจหลักฐานด้วยตนเอง และไม่มอบสมุดสะท้อนให้เธอเขียนแทน
        </p>
        <p className="cert-date">{date}</p>
        <p className="note">บันทึกในเครื่องนี้ ไม่ใช่ปริญญาของมหาวิทยาลัยใด และไม่ใช่ใบรับรองจากบริษัทเครื่องมือ</p>
      </article>
      <button type="button" className="btn primary" onClick={() => window.print()} disabled={!complete}>
        พิมพ์ / บันทึกเป็น PDF
      </button>
    </div>
  );
}
