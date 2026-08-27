"use client";

import { useEffect, useState } from "react";
import { PROGRESS_EVENT, readRubric, writeRubric } from "@/lib/progress";

export function LabRubric({ id, items }: { id: string; items: string[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readRubric(id));
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [id]);

  if (items.length === 0) return null;

  function toggle(item: string) {
    const next = done.includes(item) ? done.filter((value) => value !== item) : [...done, item];
    writeRubric(id, next);
  }

  return (
    <section className="rubric">
      <p className="eyebrow">รูบริกแล็บ · แบบมหาวิทยาลัย</p>
      <h2>เกณฑ์ผ่านที่ตรวจเอง</h2>
      <p className="lede">
        ติ๊กเมื่อเปิดหลักฐานได้เอง ผ่าน {done.filter((item) => items.includes(item)).length}/{items.length}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <label>
              <input type="checkbox" checked={done.includes(item)} onChange={() => toggle(item)} />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
