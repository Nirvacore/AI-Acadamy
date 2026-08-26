"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import {
  PROGRESS_EVENT,
  journalFilled,
  readChecks,
  readDone,
  readLast,
  readPlan,
  type PlanId,
} from "@/lib/progress";
import type { PortalLesson } from "@/components/Dashboard";

function slots(lessons: PortalLesson[], plan: PlanId) {
  if (plan === "intensive") {
    return Array.from({ length: 7 }, (_, day) => ({
      label: `วันที่ ${day + 1}`,
      items: lessons.slice(day * 2, day * 2 + 2),
    }));
  }
  return Array.from({ length: 4 }, (_, week) => ({
    label: `สัปดาห์ที่ ${week + 1}`,
    items: lessons.slice(week * 4, week * 4 + 4),
  }));
}

export function WeekPlan({ lessons }: { lessons: PortalLesson[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [plan, setPlan] = useState<PlanId>("intensive");
  const [last, setLast] = useState("");

  useEffect(() => {
    const sync = () => {
      setDone(readDone());
      setPlan(readPlan());
      setLast(readLast());
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const groups = useMemo(() => slots(lessons, plan), [lessons, plan]);

  return (
    <section className="week-plan">
      <p className="eyebrow">ปฏิทินเรียนตามแผน</p>
      <h2>{plan === "intensive" ? "เจ็ดวัน" : "สี่สัปดาห์"}</h2>
      {last ? (
        <p>
          ค้างไว้ที่ <TrackedLink href={last}>เปิดหน้าที่เรียนล่าสุด</TrackedLink>
        </p>
      ) : null}
      <div className="week-grid">
        {groups.map((group) => (
          <article key={group.label} className="card">
            <p className="eyebrow">{group.label}</p>
            <ul>
              {group.items.map((lesson) => (
                <li key={lesson.id} className={done.includes(lesson.id) ? "is-done" : ""}>
                  <TrackedLink href={`/learn/${lesson.slug}`}>{lesson.title_th}</TrackedLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
