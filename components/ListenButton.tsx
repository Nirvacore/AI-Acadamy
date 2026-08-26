"use client";

import { useEffect, useState } from "react";

export function ListenButton({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady("speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  if (!ready) return null;

  function toggle() {
    if (on) {
      window.speechSynthesis.cancel();
      setOn(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = 0.95;
    utterance.onend = () => setOn(false);
    utterance.onerror = () => setOn(false);
    window.speechSynthesis.speak(utterance);
    setOn(true);
  }

  return (
    <button type="button" className="btn ghost" onClick={toggle}>
      {on ? "หยุดฟัง" : "ฟังบทพูดไทย"}
    </button>
  );
}
