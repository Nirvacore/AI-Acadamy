"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import {
  PLANS,
  PROGRESS_EVENT,
  journalFilled,
  readChecks,
  readDone,
  readPlan,
  writePlan,
  type PlanId,
} from "@/lib/progress";

export type PortalLesson = {
  id: string;
  slug: string;
  title_th: string;
  moduleName: string;
  phase: number;
  minutes: number;
  outcome: string;
  labSlug?: string;
};

export function Dashboard({
  lessons,
  hours,
}: {
  lessons: PortalLesson[];
  hours: number;
}) {
  const [done, setDone] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, number>>({});
  const [plan, setPlan] = useState<PlanId>("intensive");
  const [journals, setJournals] = useState(0);

  useEffect(() => {
    const sync = () => {
      const ids = readDone();
      setDone(ids);
      setChecks(readChecks());
      setPlan(readPlan());
      setJournals(lessons.filter((lesson) => journalFilled(lesson.id)).length);
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [lessons]);

  const finished = done.filter((id) => lessons.some((lesson) => lesson.id === id)).length;
  const checkPassed = lessons.filter((lesson) => (checks[lesson.id] ?? 0) >= 1).length;
  const next = useMemo(
    () => lessons.find((lesson) => !done.includes(lesson.id)),
    [done, lessons],
  );
  const remainingMin = lessons
    .filter((lesson) => !done.includes(lesson.id))
    .reduce((sum, lesson) => sum + lesson.minutes, 0);
  const todayCount = plan === "intensive" ? 2 : 1;
  const today = lessons.filter((lesson) => !done.includes(lesson.id)).slice(0, todayCount);
  const percent = Math.round((finished / Math.max(lessons.length, 1)) * 100);

  return (
    <section className="portal">
      <div className="stat-row">
        <article className="stat">
          <p className="eyebrow">บทที่จบ</p>
          <strong>
            {finished}/{lessons.length}
          </strong>
          <span>{percent}%</span>
        </article>
        <article className="stat">
          <p className="eyebrow">ตรวจความเข้าใจ</p>
          <strong>
            {checkPassed}/{lessons.length}
          </strong>
          <span>แบบสอบสั้นท้ายบท</span>
        </article>
        <article className="stat">
          <p className="eyebrow">สมุดสะท้อน</p>
          <strong>
            {journals}/{lessons.length}
          </strong>
          <span>เขียนเอง ห้ามให้เธอแทน</span>
        </article>
        <article className="stat">
          <p className="eyebrow">ชั่วโมงที่เหลือ</p>
          <strong>{Math.max(0, Math.round(remainingMin / 6) / 10)}</strong>
          <span>จากทั้งหมด {hours} ชม.</span>
        </article>
      </div>

      <div className="continue-card">
        <p className="eyebrow">จังหวะเรียนในเครื่องนี้</p>
        <div className="plan-switch" role="tablist" aria-label="แผนเรียน">
          {PLANS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={plan === item.id}
              className={plan === item.id ? "is-on" : ""}
              onClick={() => writePlan(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <p className="lede">{PLANS.find((item) => item.id === plan)?.pace}</p>
        {next ? (
          <>
            <h2>รอบนี้: {next.title_th}</h2>
            <p>
              {next.moduleName} · ประมาณ {next.minutes} นาที · อย่าข้ามลำดับถ้ายังไม่จับภาพหลอนได้
            </p>
            <div className="actions">
              <TrackedLink className="btn primary" href={`/learn/${next.slug}`}>
                เรียนต่อ
              </TrackedLink>
              {next.labSlug ? (
                <TrackedLink className="btn ghost" href={`/lab/${next.labSlug}`}>
                  ไปแล็บ
                </TrackedLink>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <h2>ครบวงจรในเครื่องนี้แล้ว</h2>
            <p>ตรวจเทสร้านค้าด้วยตา แล้วออกเกียรติบัตรได้ถ้าสมุดและแบบตรวจครบ</p>
            <div className="actions">
              <TrackedLink className="btn primary" href="/shop">
                ร้านค้าตัวอย่าง
              </TrackedLink>
              <TrackedLink className="btn ghost" href="/certificate">
                เกียรติบัตร
              </TrackedLink>
            </div>
          </>
        )}
      </div>

      {today.length ? (
        <div className="today-list">
          <p className="eyebrow">งานวันนี้ตามแผน</p>
          <ol>
            {today.map((lesson) => (
              <li key={lesson.id}>
                <TrackedLink href={`/learn/${lesson.slug}`}>{lesson.title_th}</TrackedLink>
                <span>
                  {lesson.minutes} นาที · {lesson.moduleName}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
