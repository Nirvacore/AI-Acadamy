import { Suspense } from "react";
import { StartContinue } from "@/components/StartClass";
import { TrackSwitch, TrackedLink } from "@/components/TrackSwitch";
import { portalLessons } from "@/lib/catalog";

export const metadata = {
  title: "ชั่วโมงแรก",
  description: "นั่งลงสิบห้านาที ล็อกว่าเธอคือเอเจนต์ แล้วเริ่มบทกระจก",
};

export default function StartPage() {
  const lessons = portalLessons();

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

      <Suspense fallback={null}>
        <StartContinue lessons={lessons} />
      </Suspense>

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
        <Suspense fallback={<p className="save-hint">เลือกแทร็กได้จากเมนูซ้ายด้วย</p>}>
          <TrackSwitch />
        </Suspense>
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
        <TrackedLink className="btn ghost" href="/">
          ดูลำดับทั้งหมด
        </TrackedLink>
      </div>
    </article>
  );
}
