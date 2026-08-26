"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TRACK_KEY, withTrack } from "@/components/TrackSwitch";

function typing(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function LessonKeys({ prev, next }: { prev?: string; next?: string }) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (typing(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      const track = window.localStorage.getItem(TRACK_KEY) ?? "cursor";
      if (event.key === "]" && next) {
        event.preventDefault();
        router.push(withTrack(next, track));
      }
      if (event.key === "[" && prev) {
        event.preventDefault();
        router.push(withTrack(prev, track));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, router]);

  return null;
}
