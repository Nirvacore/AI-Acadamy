"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogItem } from "@/lib/types";
import { TRACK_KEY, withTrack } from "@/components/TrackSwitch";

function fold(value: string) {
  return value.normalize("NFC").toLowerCase();
}

function matches(item: CatalogItem, query: string) {
  const hay = fold(`${item.title} ${item.hint} ${item.id} ${item.href}`);
  return query.split(/\s+/).filter(Boolean).every((part) => hay.includes(fold(part)));
}

function kindLabel(kind: CatalogItem["kind"]) {
  switch (kind) {
    case "lesson":
      return "บท";
    case "lab":
      return "แล็บ";
    case "script":
      return "สคริปต์";
    case "term":
      return "ศัพท์";
    default:
      return "หน้า";
  }
}

export function CommandPalette({ catalog }: { catalog: CatalogItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    const list = !q
      ? catalog.filter((item) => item.kind !== "term").slice(0, 12)
      : catalog.filter((item) => matches(item, q));
    return list.slice(0, 16);
  }, [catalog, query]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => input.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(item: CatalogItem) {
    const track = window.localStorage.getItem(TRACK_KEY) ?? "cursor";
    setOpen(false);
    router.push(withTrack(item.href, track));
  }

  return (
    <>
      <button type="button" className="cmd-open" onClick={() => setOpen(true)}>
        ค้นหา <kbd>⌘K</kbd>
      </button>
      {open ? (
        <div className="cmd-root" role="dialog" aria-modal="true" aria-label="ค้นหาหลักสูตร">
          <button type="button" className="cmd-backdrop" aria-label="ปิด" onClick={() => setOpen(false)} />
          <div className="cmd-panel">
            <input
              ref={input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="บท แล็บ ศัพท์ แทร็ก หรือหน้าที่ต้องการ"
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((value) => Math.max(value - 1, 0));
                } else if (event.key === "Enter" && results[active]) {
                  event.preventDefault();
                  go(results[active]);
                }
              }}
            />
            <ul>
              {results.length === 0 ? <li className="cmd-empty">ไม่พบในหลักสูตรนี้</li> : null}
              {results.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={index === active ? "is-on" : ""}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                  >
                    <span className="cmd-kind">{kindLabel(item.kind)}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.hint}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="cmd-foot">ค้นชื่อบท ศัพท์ อังกฤษ หรือสลักเช่น hallucinations · ลูกศรเลือก · Enter เปิด</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
