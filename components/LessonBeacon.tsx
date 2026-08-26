"use client";

import { useEffect, useState } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import type { LessonMetaView } from "@/lib/types";
import { PROGRESS_EVENT, readDone } from "@/lib/progress";

export function LessonBeacon({ meta }: { meta: LessonMetaView }) {
  const [ready, setReady] = useState(true);

  useEffect(() => {
    const sync = () => {
      if (!meta.prereq) {
        setReady(true);
        return;
      }
      setReady(readDone().includes(meta.prereq.id));
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [meta.prereq]);

  return (
    <div className="beacon">
      <p className="kicker-row">
        <span>
          {meta.moduleName} · {meta.minutes} นาที
        </span>
        {meta.labSlug ? <TrackedLink href={`/lab/${meta.labSlug}`}>แล็บ</TrackedLink> : null}
        {meta.scriptSlug ? <TrackedLink href={`/script/${meta.scriptSlug}`}>สคริปต์</TrackedLink> : null}
      </p>
      {meta.outcome ? (
        <p className="outcome">
          <strong>ผลลัพธ์เมื่อจบ</strong> {meta.outcome}
        </p>
      ) : null}
      {!ready && meta.prereq ? (
        <p className="gate">
          มหาวิทยาลัยแนะนำไม่ข้ามบทก่อนหน้า:{" "}
          <TrackedLink href={`/learn/${meta.prereq.slug}`}>{meta.prereq.title_th}</TrackedLink>
        </p>
      ) : null}
    </div>
  );
}
