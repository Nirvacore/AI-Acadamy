"use client";

import { useEffect, useState } from "react";
import { markTourSeen, tourSeen } from "@/lib/progress";

const STEPS = [
  "เลือกแทร็กบริษัทด้านซ้ายให้ตรงเครื่องมือบนเครื่องคุณ",
  "กด ⌘K เพื่อค้นบท แล็บ หรือศัพท์ เหมือน Canvas และ Cursor",
  "เรียนตามลำดับ อย่าข้ามภาพหลอน แล้วทำสอบสั้นกับรูบริกแล็บเอง",
  "สมุดสะท้อนและข้อสอบสั้นต้องคิดเอง ห้ามให้เธอเขียนแทน",
];

export function Onboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!tourSeen());
  }, []);

  if (!open) return null;

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label="เริ่มเรียน">
      <div className="tour-card">
        <p className="eyebrow">ครั้งแรกในเครื่องนี้</p>
        <h2>วิธีเรียนให้เท่ามหาวิทยาลัย</h2>
        <ol>
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            markTourSeen();
            setOpen(false);
          }}
        >
          เริ่มได้
        </button>
      </div>
    </div>
  );
}
