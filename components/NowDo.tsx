"use client";

import { useEffect, useState } from "react";
import type { NowSheet } from "@/lib/nowdo";
import { PROGRESS_EVENT, readNowDo, writeNowDo } from "@/lib/progress";

export function NowDo({ id, sheet }: { id: string; sheet?: NowSheet }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readNowDo(id));
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [id]);

  if (!sheet) return null;

  const total = sheet.steps.length;
  const count = sheet.steps.filter((step) => done.includes(step.id)).length;
  const complete = count === total && total > 0;

  function toggle(stepId: string) {
    const next = done.includes(stepId) ? done.filter((item) => item !== stepId) : [...done, stepId];
    writeNowDo(id, next);
  }

  return (
    <aside className="nowdo" id="nowdo" aria-labelledby="nowdo-title">
      <p className="eyebrow">ตอนนี้ทำ · {sheet.sitting}</p>
      <h2 id="nowdo-title">นั่งนี้เข้าใจเรื่องนี้</h2>
      <p className="gist">{sheet.gist}</p>
      <p className="nowdo-kicker">จำสามข้อนี้ แล้วทำตามลิสต์</p>
      <ul className="remember">
        {sheet.remember.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <ol className="nowdo-steps">
        {sheet.steps.map((step, index) => (
          <li key={step.id}>
            <label>
              <input
                type="checkbox"
                checked={done.includes(step.id)}
                onChange={() => toggle(step.id)}
              />
              <span>
                <strong>{index + 1}.</strong> {step.text}
              </span>
            </label>
          </li>
        ))}
      </ol>
      <p className={complete ? "nowdo-next is-done" : "nowdo-next"}>
        {complete ? "ลิสต์นั่งนี้ครบแล้ว · " : `ทำแล้ว ${count}/${total} · `}
        {sheet.nextHint}
      </p>
    </aside>
  );
}
