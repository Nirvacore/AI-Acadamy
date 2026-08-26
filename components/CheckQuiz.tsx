"use client";

import { useEffect, useState } from "react";
import type { CheckItem } from "@/lib/types";
import { PROGRESS_EVENT, readChecks, writeCheckScore } from "@/lib/progress";

export function CheckQuiz({ lessonId, items }: { lessonId: string; items: CheckItem[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const sync = () => setBest(readChecks()[lessonId] ?? 0);
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [lessonId]);

  if (items.length === 0) return null;

  const score = items.filter((item, index) => picked[index] === item.answer).length;
  const pass = score === items.length;

  function submit() {
    setSubmitted(true);
    writeCheckScore(lessonId, score);
  }

  return (
    <section className="check-quiz">
      <p className="eyebrow">ตรวจว่าเข้าใจจริง</p>
      <h2>ตอบเองท้ายบท</h2>
      <p className="lede">
        คิดก่อนเปิดเฉลย อย่าให้เธอเลือกแทน คะแนนดีที่สุดในเครื่องนี้คือ {best}/{items.length}
      </p>
      {items.map((item, index) => (
        <fieldset key={item.q}>
          <legend>
            {index + 1}. {item.q}
          </legend>
          {item.choices.map((choice, choiceIndex) => {
            const chosen = picked[index] === choiceIndex;
            const show = submitted;
            const correct = choiceIndex === item.answer;
            return (
              <label
                key={choice}
                className={
                  show && correct ? "is-correct" : show && chosen && !correct ? "is-wrong" : ""
                }
              >
                <input
                  type="radio"
                  name={`${lessonId}-${index}`}
                  checked={chosen}
                  onChange={() => {
                    setSubmitted(false);
                    setPicked((prev) => ({ ...prev, [index]: choiceIndex }));
                  }}
                />
                {choice}
              </label>
            );
          })}
          {submitted ? <p className="why">{item.why}</p> : null}
        </fieldset>
      ))}
      <button type="button" className="btn primary" onClick={submit}>
        ตรวจคำตอบ
      </button>
      {submitted ? (
        <p className="lede">
          {pass ? "ผ่านชุดนี้แล้ว" : "ยังไม่ครบ อ่านบทอีกครั้งแล้วตอบใหม่"} · ได้ {score}/
          {items.length}
        </p>
      ) : null}
    </section>
  );
}
