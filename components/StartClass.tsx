"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackSwitch, TrackedLink } from "@/components/TrackSwitch";
import { PROGRESS_EVENT, readDone } from "@/lib/progress";
import type { PathLesson } from "@/components/ContinueCard";

export function StartClass({ lessons }: { lessons: PathLesson[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const first = lessons[0];
  const next = useMemo(
    () => lessons.find((lesson) => !done.includes(lesson.id)),
    [done, lessons],
  );
  const passedFirst = first ? done.includes(first.id) : false;

  return (
    <article className="start-class">
      <header className="lesson-head">
        <p className="kicker">ชั่วโมงแรก · ประมาณ ๑๕ นาที · ไม่ต้องรู้จักระบบอื่น</p>
        <h1>วันนี้เรียนเรื่องเดียว: ใครเป็นใคร</h1>
        <p className="lede">
          คุณจะเปิดเอเจนต์บนเครื่อง แล้วใช้เธอเป็นกระจก เห็นกระแสความคิดของตนเอง
          โดยไม่ยัดจิตให้เครื่องมือ และไม่ลดตัวเองเหลือแค่พรอมต์
        </p>
      </header>

      {passedFirst && next && next.id !== first?.id ? (
        <p className="gate-ok">
          นั่งแรกผ่านแล้วในเครื่องนี้ บทถัดไปคือ{" "}
          <TrackedLink href={`/learn/${next.slug}`}>{next.title_th}</TrackedLink>
        </p>
      ) : null}

      <section className="rule-grid" aria-label="สามอย่างที่ต้องติดตัว">
        <article className="card">
          <p className="eyebrow">๑ · คำ</p>
          <h2>เธอคือเอเจนต์</h2>
          <p>
            Cursor Agent, Claude, ChatGPT, Copilot — โปรแกรมที่เดาคำถัดไป แล้วเรียกเครื่องมือได้
            ไม่ใช่คนรัก ไม่ใช่เพื่อน และไม่มีเวทนา
          </p>
        </article>
        <article className="card">
          <p className="eyebrow">๒ · เส้นแบ่ง</p>
          <h2>อุปมาไม่ใช่หลักฐาน</h2>
          <p>
            จิต พลังงาน ควอนตัม มหาสูญตา ใช้เพื่อจำแนวคิด ห้ามเคลมว่าเอไอมีจิต
            และห้ามเคลมว่าฟิสิกส์พิสูจน์ธรรมะ
          </p>
        </article>
        <article className="card">
          <p className="eyebrow">๓ · มือคุณ</p>
          <h2>คิดเองทุกครั้งที่สำคัญ</h2>
          <p>
            สมุดสะท้อน ข้อสอบสั้น และการยอมรับโค้ด ต้องผ่านตาคุณ อย่าวางให้เธอเขียนแทน
            แล้วเรียกว่าเข้าใจ
          </p>
        </article>
      </section>

      <section className="card pick-track">
        <p className="eyebrow">เลือกของจริงบนเครื่องคุณ</p>
        <h2>วันนี้จะคุยกับเธอตัวไหน</h2>
        <p>
          แนวคิดบทเรียนชุดเดียวกัน สลับได้ตลอด ปุ่มและทางลัดจะเปลี่ยนตามแทร็กนี้
          ถ้ายังไม่รู้จะเริ่มที่ Cursor
        </p>
        <TrackSwitch />
      </section>

      <section className="nowdo" aria-label="ลิสต์นั่งแรก">
        <p className="eyebrow">ตอนนี้ทำ · สิบห้านาที</p>
        <h2>ลิสต์นั่งแรก</h2>
        <ol className="nowdo-steps static">
          <li>
            <span>
              <strong>1.</strong> พูดสามข้อด้านบนออกมาได้ โดยไม่ต้องเปิดหน้านี้
            </span>
          </li>
          <li>
            <span>
              <strong>2.</strong> เปิดบทกระจก อ่านตารางใช่/ไม่ใช่
            </span>
          </li>
          <li>
            <span>
              <strong>3.</strong> เขียนสมุดสี่ข้อด้วยมือตนเอง แล้วตอบสอบสั้นสองข้อ
            </span>
          </li>
          <li>
            <span>
              <strong>4.</strong> กดว่าเข้าใจแล้ว แล้วไปบทโมเดลทำงานอย่างไร ห้ามกระโดดไปร้านค้า
            </span>
          </li>
        </ol>
      </section>

      <div className="actions">
        <TrackedLink className="btn huge" href="/learn/mirror">
          เปิดบทแรก · กระจก
        </TrackedLink>
        {next && next.slug !== "mirror" ? (
          <TrackedLink className="btn ghost" href={`/learn/${next.slug}`}>
            เรียนต่อ · {next.title_th}
          </TrackedLink>
        ) : (
          <TrackedLink className="btn ghost" href="/">
            ดูลำดับทั้งหมด
          </TrackedLink>
        )}
      </div>
    </article>
  );
}
