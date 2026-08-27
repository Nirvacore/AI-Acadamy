"use client";

import { useRef, useState } from "react";
import { exportProgress, importProgress, type ProgressDump } from "@/lib/progress";

export function ProgressSync() {
  const file = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  function download() {
    const blob = new Blob([JSON.stringify(exportProgress(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nirva-academy-progress.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("ส่งออกแล้ว ย้ายเครื่องได้โดยไม่ต้องพึ่งเซิร์ฟเวอร์");
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0];
    if (!chosen) return;
    try {
      const dump = JSON.parse(await chosen.text()) as ProgressDump;
      importProgress(dump);
      setMessage("นำเข้าแล้ว รีเฟรชหน้าถ้าตัวเลขยังไม่ขยับ");
    } catch {
      setMessage("ไฟล์นี้ไม่ใช่ความคืบหน้าของ Nirva Academy");
    }
  }

  return (
    <section className="sync-box">
      <p className="eyebrow">ย้ายเครื่อง</p>
      <h2>ส่งออกและนำเข้าความคืบหน้า</h2>
      <p className="lede">
        บทเรียน จดสะท้อน แบบตรวจ และบัตรคำอยู่ที่เบราว์เซอร์นี้ เหมือน LMS ที่ผู้เรียนถือข้อมูลเอง
      </p>
      <div className="actions">
        <button type="button" className="btn primary" onClick={download}>
          ส่งออก JSON
        </button>
        <button type="button" className="btn ghost" onClick={() => file.current?.click()}>
          นำเข้า JSON
        </button>
      </div>
      <input
        ref={file}
        type="file"
        accept="application/json"
        hidden
        onChange={(event) => void upload(event)}
      />
      {message ? <p className="save-hint">{message}</p> : null}
    </section>
  );
}
