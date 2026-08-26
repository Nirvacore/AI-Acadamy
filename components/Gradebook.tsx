"use client";

import { useEffect, useState } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import {
  PROGRESS_EVENT,
  journalFilled,
  readChecks,
  readDone,
  readSeconds,
} from "@/lib/progress";

export type GradeRow = {
  id: string;
  slug: string;
  title_th: string;
  checkTotal: number;
};

export function Gradebook({ rows }: { rows: GradeRow[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, number>>({});
  const [journals, setJournals] = useState<Record<string, boolean>>({});
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const sync = () => {
      setDone(readDone());
      setChecks(readChecks());
      setJournals(Object.fromEntries(rows.map((row) => [row.id, journalFilled(row.id)])));
      setSeconds(readSeconds());
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [rows]);

  const lessonScore = rows.filter((row) => done.includes(row.id)).length / rows.length;
  const checkScore =
    rows.reduce((sum, row) => {
      const total = Math.max(row.checkTotal, 1);
      return sum + Math.min((checks[row.id] ?? 0) / total, 1);
    }, 0) / rows.length;
  const journalScore = rows.filter((row) => journals[row.id]).length / rows.length;
  const overall = Math.round((lessonScore * 0.4 + checkScore * 0.3 + journalScore * 0.3) * 100);

  return (
    <section className="gradebook">
      <p className="lede">
        คะแนนประเมินตนเอง {overall}% · น้ำหนักแบบมหาวิทยาลัย แล็บ/บท ๔๐ สอบสั้น ๓๐ สมุด ๓๐ · เวลาที่จับได้{" "}
        {Math.round(seconds / 60)} นาที
      </p>
      <table>
        <thead>
          <tr>
            <th>บท</th>
            <th>จบ</th>
            <th>สอบสั้น</th>
            <th>สมุด</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <TrackedLink href={`/learn/${row.slug}`}>{row.title_th}</TrackedLink>
              </td>
              <td>{done.includes(row.id) ? "ผ่าน" : "ยัง"}</td>
              <td>
                {checks[row.id] ?? 0}/{row.checkTotal}
              </td>
              <td>{journals[row.id] ? "มี" : "ยัง"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
