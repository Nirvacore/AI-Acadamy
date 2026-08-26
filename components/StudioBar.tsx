"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  readFocus,
  readSeconds,
  writeFocus,
  writeLast,
  writeSeconds,
} from "@/lib/progress";

function typing(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function clock(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function StudioBar() {
  const pathname = usePathname();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [focus, setFocus] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    setSeconds(readSeconds());
    const on = readFocus();
    setFocus(on);
    document.body.classList.toggle("is-focus", on);
  }, []);

  useEffect(() => {
    writeLast(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((value) => {
        const next = value + 1;
        if (next % 15 === 0) writeSeconds(next);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (typing(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "?") {
        event.preventDefault();
        setHelp((value) => !value);
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        const next = !document.body.classList.contains("is-focus");
        writeFocus(next);
        setFocus(next);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleTimer() {
    if (running) writeSeconds(seconds);
    setRunning((value) => !value);
  }

  function toggleFocus() {
    const next = !focus;
    writeFocus(next);
    setFocus(next);
  }

  return (
    <>
      <div className="studio-bar" role="region" aria-label="สตูดิโอเรียน">
        <button type="button" onClick={toggleTimer}>
          {running ? "พักเวลา" : "เริ่มจับเวลา"} · {clock(seconds)}
        </button>
        <button type="button" onClick={toggleFocus}>
          {focus ? "แสดงเมนู" : "โหมดโฟกัส"}
        </button>
        <button type="button" onClick={() => setHelp((value) => !value)}>
          ปุ่มลัด ?
        </button>
      </div>
      {help ? (
        <div className="help-pop" role="dialog" aria-label="ปุ่มลัด">
          <p className="eyebrow">เรียนด้วยคีย์บอร์ด</p>
          <ul>
            <li>
              <kbd>⌘K</kbd> ค้นหลักสูตร
            </li>
            <li>
              <kbd>[</kbd> บทก่อน · <kbd>]</kbd> บทถัดไป
            </li>
            <li>
              <kbd>F</kbd> โหมดโฟกัส
            </li>
            <li>
              <kbd>?</kbd> เปิด-ปิดแผ่นนี้
            </li>
          </ul>
          <button type="button" className="btn ghost" onClick={() => setHelp(false)}>
            ปิด
          </button>
        </div>
      ) : null}
    </>
  );
}
