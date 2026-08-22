"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const TRACK_KEY = "ai-acadamy:track";
export const DONE_KEY = "ai-acadamy:done";

const TRACKS = [
  { id: "cursor", name: "Cursor" },
  { id: "claude", name: "Claude" },
  { id: "openai", name: "OpenAI" },
  { id: "copilot", name: "Copilot" },
];

export function TrackSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [track, setTrack] = useState(searchParams.get("track") ?? "cursor");

  useEffect(() => {
    const saved = window.localStorage.getItem(TRACK_KEY);
    const initial = searchParams.get("track") ?? saved ?? "cursor";
    setTrack(initial);
    window.localStorage.setItem(TRACK_KEY, initial);
    if (!searchParams.get("track") && initial !== "cursor") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("track", initial);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, router, searchParams]);

  function select(id: string) {
    setTrack(id);
    window.localStorage.setItem(TRACK_KEY, id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("track", id);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="track-switch" role="tablist" aria-label="แทร็กบริษัท">
      {TRACKS.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={track === item.id}
          className={track === item.id ? "is-on" : ""}
          onClick={() => select(item.id)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export function ProgressMark({ id }: { id: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ids: string[] = JSON.parse(window.localStorage.getItem(DONE_KEY) ?? "[]");
    setDone(ids.includes(id));
  }, [id]);

  function toggle() {
    const ids: string[] = JSON.parse(window.localStorage.getItem(DONE_KEY) ?? "[]");
    const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
    window.localStorage.setItem(DONE_KEY, JSON.stringify(next));
    setDone(next.includes(id));
  }

  return (
    <button type="button" className={done ? "progress-mark is-on" : "progress-mark"} onClick={toggle}>
      {done ? "เรียนแล้ว" : "ทำเครื่องหมายว่าเรียนแล้ว"}
    </button>
  );
}

export function DoneDot({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const ids: string[] = JSON.parse(window.localStorage.getItem(DONE_KEY) ?? "[]");
    setDone(ids.includes(id));
  }, [id]);
  return done ? <span className="done-dot" title="เรียนแล้ว" /> : null;
}

export function withTrack(href: string, track: string) {
  if (href.startsWith("http") || href.startsWith("#")) return href;
  const [path, hash] = href.split("#");
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}track=${track}${hash ? `#${hash}` : ""}`;
}

export function TrackedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const track = searchParams.get("track") ?? "cursor";
  return (
    <Link className={className} href={withTrack(href, track)}>
      {children}
    </Link>
  );
}
