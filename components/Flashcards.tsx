"use client";

import { useEffect, useMemo, useState } from "react";
import type { GlossaryCard } from "@/lib/types";
import { PROGRESS_EVENT, readLeitner, writeLeitner } from "@/lib/progress";

export function Flashcards({ cards }: { cards: GlossaryCard[] }) {
  const [box, setBox] = useState<Record<string, number>>({});
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const sync = () => setBox(readLeitner());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const queue = useMemo(() => {
    const ranked = [...cards].sort((a, b) => (box[a.id] ?? 1) - (box[b.id] ?? 1));
    return ranked.length ? ranked : cards;
  }, [box, cards]);

  const card = queue[index % Math.max(queue.length, 1)];
  if (!card) return null;

  function grade(delta: number) {
    const current = box[card.id] ?? 1;
    const next = Math.min(3, Math.max(1, current + delta));
    writeLeitner({ ...box, [card.id]: next });
    setFlipped(false);
    setIndex((value) => value + 1);
  }

  const due = cards.filter((item) => (box[item.id] ?? 1) < 3).length;

  return (
    <section className="flash">
      <p className="eyebrow">ทบทวนแบบ Anki · กล่อง Leitner ง่าย</p>
      <h2>บัตรคำ</h2>
      <p className="lede">
        ยังไม่คล่อง {due} จาก {cards.length} คำ กลับด้านแล้วเลือก «ยัง» หรือ «คล่อง» — ความจำระยะยาวมาจากการดึงเอง ไม่ใช่การอ่านซ้ำ
      </p>
      <button type="button" className="flash-card" onClick={() => setFlipped((value) => !value)}>
        <span className="eyebrow">{flipped ? card.en : "คำไทย"}</span>
        <strong>{flipped ? card.meaning : card.th}</strong>
        {flipped ? <small>{card.th}</small> : <small>แตะเพื่อกลับด้าน</small>}
      </button>
      <div className="actions">
        <button type="button" className="btn ghost" onClick={() => grade(-1)}>
          ยัง
        </button>
        <button type="button" className="btn primary" onClick={() => grade(1)}>
          คล่อง
        </button>
      </div>
    </section>
  );
}
