"use client";

import { useEffect, useState } from "react";
import { PROGRESS_EVENT, readDone } from "@/lib/progress";

export function RailProgress({ total }: { total: number }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const sync = () => setDone(readDone().length);
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const percent = Math.round((Math.min(done, total) / Math.max(total, 1)) * 100);

  return (
    <div className="rail-progress" aria-label="ความคืบหน้าหลักสูตร">
      <span>
        {Math.min(done, total)}/{total} บท
      </span>
      <span className="bar">
        <span style={{ width: `${percent}%` }} />
      </span>
    </div>
  );
}
