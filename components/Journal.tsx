"use client";

import { useEffect, useState } from "react";
import { JOURNAL_KEY } from "@/components/TrackSwitch";

function readAll(): Record<string, Record<string, string>> {
  try {
    return JSON.parse(window.localStorage.getItem(JOURNAL_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function Journal({
  id,
  prompts,
}: {
  id: string;
  prompts?: string[];
}) {
  const fields = prompts ?? ["ฉันเห็นอะไรในตนเอง", "ฉันเข้าใจเธอตรงไหน และยังสับสนตรงไหน"];
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const all = readAll();
    setValues(all[id] ?? {});
  }, [id]);

  function update(field: string, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    const all = readAll();
    all[id] = next;
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(all));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  return (
    <section className="journal">
      <p className="eyebrow">สมุดสะท้อน — เขียนเอง ห้ามให้เธอแต่ง</p>
      <h2>ฉันกับเธอ</h2>
      <p className="lede">
        ข้อความนี้อยู่ในเบราว์เซอร์นี้เท่านั้น ไม่ถูกส่งไปโมเดล ถ้าแปะให้เธอเขียนแทน แล็บสะท้อนไม่นับ
      </p>
      {fields.map((field) => (
        <label key={field}>
          <span>{field}</span>
          <textarea
            rows={4}
            value={values[field] ?? ""}
            onChange={(event) => update(field, event.target.value)}
          />
        </label>
      ))}
      <p className="save-hint">{saved ? "บันทึกแล้ว" : "พิมพ์แล้วเก็บอัตโนมัติ"}</p>
    </section>
  );
}

export function JournalIndex() {
  const [entries, setEntries] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    setEntries(readAll());
  }, []);

  const ids = Object.keys(entries);

  if (ids.length === 0) {
    return <p className="lede">ยังไม่มีบันทึกในเบราว์เซอร์นี้ เปิดแล็บแล้วเขียนที่ท้ายหน้า</p>;
  }

  return (
    <div className="journal-index">
      {ids.map((id) => (
        <article className="card" key={id}>
          <h2>{id}</h2>
          {Object.entries(entries[id] ?? {}).map(([field, text]) =>
            text ? (
              <p key={field}>
                <strong>{field}</strong>
                <br />
                {text}
              </p>
            ) : null,
          )}
        </article>
      ))}
    </div>
  );
}
