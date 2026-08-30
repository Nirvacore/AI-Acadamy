"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MEDIA_LAB_KEY, TRACK_KEY, PROGRESS_EVENT, readDone, writeDone } from "@/lib/progress";
import { canOpenLesson, LESSON_IDS, migratePiece } from "@/lib/media-lab-gates";

export {
  TRACK_KEY,
  DONE_KEY,
  JOURNAL_KEY,
  PROGRESS_EVENT,
  readDone,
  writeDone,
} from "@/lib/progress";

const TRACKS = [
  { id: "cursor", name: "Cursor" },
  { id: "claude", name: "Claude" },
  { id: "openai", name: "OpenAI" },
  { id: "copilot", name: "Copilot" },
];

export function useTrackId() {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("track");
  const [track, setTrack] = useState(fromUrl ?? "cursor");

  useEffect(() => {
    const saved = window.localStorage.getItem(TRACK_KEY);
    setTrack(fromUrl ?? saved ?? "cursor");
  }, [fromUrl]);

  return track;
}

export function TrackLabel({ tracks }: { tracks: { id: string; name: string }[] }) {
  return (
    <Suspense fallback={null}>
      <TrackLabelInner tracks={tracks} />
    </Suspense>
  );
}

function TrackLabelInner({ tracks }: { tracks: { id: string; name: string }[] }) {
  const id = useTrackId();
  return <>{tracks.find((item) => item.id === id)?.name ?? id}</>;
}

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
    <div className="track-switch" role="group" aria-label="แทร็กบริษัท">
      {TRACKS.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={track === item.id}
          className={track === item.id ? "is-on" : ""}
          onClick={() => select(item.id)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export function MediaLessonMark({ id }: { id: string }) {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    const sync = () => {
      const done = readDone().filter((item) => LESSON_IDS.includes(item));
      let piece = migratePiece(null);
      try {
        const raw = window.localStorage.getItem(MEDIA_LAB_KEY);
        piece = migratePiece(raw ? JSON.parse(raw) : null);
      } catch {
        piece = migratePiece(null);
      }
      setLocked(!canOpenLesson(id, done, piece));
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [id]);

  if (locked) {
    return (
      <p className="gate" role="status">
        จบตอนก่อนหน้าก่อน จึงทำเครื่องหมายว่าเข้าใจบทนี้
      </p>
    );
  }
  return <ProgressMark id={id} />;
}

export function ProgressMark({ id }: { id: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sync = () => setDone(readDone().includes(id));
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [id]);

  function toggle() {
    const ids = readDone();
    writeDone(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  return (
    <button type="button" className={done ? "progress-mark is-on" : "progress-mark"} onClick={toggle}>
      {done ? "เข้าใจบทนี้แล้ว" : "ฉันเข้าใจบทนี้แล้ว"}
    </button>
  );
}

export function DoneDot({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const sync = () => setDone(readDone().includes(id));
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [id]);
  return done ? <span className="done-dot" title="เรียนแล้ว" /> : null;
}

export function withTrack(href: string, track: string) {
  if (href.startsWith("http") || href.startsWith("#")) return href;
  if (/[?&]track=/.test(href)) return href;
  const [path, hash] = href.split("#");
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}track=${track}${hash ? `#${hash}` : ""}`;
}

export function ForceTrack({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("track") === id) return;
    window.localStorage.setItem(TRACK_KEY, id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("track", id);
    router.replace(`${pathname}?${params.toString()}`);
  }, [id, pathname, router, searchParams]);

  return null;
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
  return (
    <Suspense fallback={<Link className={className} href={href}>{children}</Link>}>
      <TrackedLinkInner href={href} className={className}>
        {children}
      </TrackedLinkInner>
    </Suspense>
  );
}

function TrackedLinkInner({
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
