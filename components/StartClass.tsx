"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import { PROGRESS_EVENT, readDone } from "@/lib/progress";
import type { PathLesson } from "@/components/ContinueCard";

export function StartContinue({ lessons }: { lessons: PathLesson[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const first = lessons[0];
  const next = useMemo(
    () => lessons.find((lesson) => !done.includes(lesson.id)),
    [done, lessons],
  );
  const passedFirst = first ? done.includes(first.id) : false;

  if (!passedFirst || !next || next.id === first?.id) return null;

  return (
    <p className="gate-ok">
      นั่งแรกผ่านแล้วในเครื่องนี้ บทถัดไปคือ{" "}
      <TrackedLink href={`/learn/${next.slug}`}>{next.title_th}</TrackedLink>
    </p>
  );
}
