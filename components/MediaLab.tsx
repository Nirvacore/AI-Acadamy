"use client";

import { useEffect, useMemo, useState } from "react";
import type { Track } from "@/lib/curriculum";
import type { MediaPipeline } from "@/lib/media-lab";
import {
  CHECKLIST,
  attemptAutoPublish,
  buildLocalDrafts,
  canEnterReview,
  emptyPiece,
  evidenceOk,
  moveStatus,
  requestPublish,
  type MediaPiece,
} from "@/lib/media-lab-gates";
import { TrackedLink, useTrackId } from "@/components/TrackSwitch";
import { MEDIA_LAB_KEY, PROGRESS_EVENT, writeJson } from "@/lib/progress";

function readPiece(): MediaPiece {
  if (typeof window === "undefined") return emptyPiece();
  try {
    const raw = window.localStorage.getItem(MEDIA_LAB_KEY);
    if (!raw) return emptyPiece();
    return { ...emptyPiece(), ...(JSON.parse(raw) as MediaPiece) };
  } catch {
    return emptyPiece();
  }
}

function savePiece(piece: MediaPiece) {
  writeJson(MEDIA_LAB_KEY, piece);
}

export function MediaLab({
  pipeline,
  tracks,
}: {
  pipeline: MediaPipeline;
  tracks: Track[];
}) {
  const trackId = useTrackId();
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const concept = track.concepts.find((item) => item.conceptId === "media-lab");
  const [piece, setPiece] = useState<MediaPiece>(emptyPiece);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sync = () => setPiece(readPiece());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  function update(patch: Partial<MediaPiece>) {
    const next = { ...piece, ...patch, publishResult: patch.publishResult ?? null };
    setPiece(next);
    savePiece(next);
  }

  function toggleCheck(id: string) {
    const checklist = piece.checklist.includes(id)
      ? piece.checklist.filter((item) => item !== id)
      : [...piece.checklist, id];
    update({ checklist });
  }

  const readyReview = canEnterReview(piece);
  const evidencePass = evidenceOk(piece.evidence);

  const stages = useMemo(() => pipeline.reuse, [pipeline.reuse]);

  function sendReview() {
    const result = moveStatus(piece, "review");
    if (!result.ok) {
      setNotice("ยังเข้า review ไม่ได้ ต้องมี brief หลักฐาน สคริปต์ และร่างในเครื่องนี้");
      return;
    }
    setNotice("ส่งตรวจแล้ว คนต้องอ่านก่อนอนุมัติ");
    setPiece(result.piece);
    savePiece(result.piece);
  }

  function approveByHuman() {
    const result = moveStatus({ ...piece, humanReviewed: true }, "approved");
    if (!result.ok) {
      setNotice("อนุมัติได้เมื่อสถานะเป็น review และคนติ๊กว่าอ่านเองแล้ว");
      return;
    }
    const next = { ...result.piece, humanReviewed: true };
    setNotice("คนอนุมัติแล้ว ยังห้ามให้เธอเผยแพร่");
    setPiece(next);
    savePiece(next);
  }

  function askQueue() {
    const result = requestPublish(piece);
    const next = { ...piece, publishResult: result };
    setNotice(result.message);
    setPiece(next);
    savePiece(next);
  }

  function trapAuto() {
    const result = attemptAutoPublish(piece);
    const next = { ...piece, publishResult: result };
    setNotice(result.message);
    setPiece(next);
    savePiece(next);
  }

  function generate() {
    if (!piece.brief.trim()) {
      setNotice("เขียน brief ก่อนจึงสร้างร่างในเครื่องนี้");
      return;
    }
    update({ assets: buildLocalDrafts(piece.brief), status: piece.status === "archived" ? "draft" : piece.status });
    setNotice("สร้างร่างสามช่องทางในเบราว์เซอร์นี้แล้ว ไม่ได้ยิง Studio จริง");
  }

  return (
    <div className="media-lab">
      <aside className="media-track" aria-live="polite">
        <p className="eyebrow">แทร็กเครื่องมือ · ไม่ใช่แท็บ Media</p>
        <h2>ทำชิ้นนี้ด้วย {track.name}</h2>
        <p>
          {concept?.labDelta ??
            "ใช้เครื่องมือที่เลือกด้านซ้ายให้ช่วยร่าง แต่คนเขียน brief คนเปิดหลักฐาน คนตรวจ"}
        </p>
        {concept?.uiLabel ? (
          <dl>
            <div>
              <dt>ที่ต้องเปิด</dt>
              <dd>{concept.uiLabel}</dd>
            </div>
            {concept.shortcut ? (
              <div>
                <dt>ทางลัด</dt>
                <dd>
                  <kbd>{concept.shortcut}</kbd>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <p className="docs">
          <a href={concept?.docsUrl ?? track.official_docs} target="_blank" rel="noreferrer">
            เอกสาร {track.name}
          </a>
        </p>
      </aside>

      <ol className="media-flow" aria-label="ไพป์ไลน์ที่ reuse จาก Nirva Media">
        {stages.map((stage, index) => (
          <li key={stage.id}>
            <span className="num">{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage.title_th}</strong>
          </li>
        ))}
      </ol>

      <section className="media-panel">
        <p className="eyebrow">01 · Brief</p>
        <label htmlFor="media-brief">เป้าหมายชิ้นงาน กลุ่มผู้ชม โทน สิ่งห้าม</label>
        <textarea
          id="media-brief"
          rows={5}
          value={piece.brief}
          onChange={(event) => update({ brief: event.target.value, status: "draft", assets: [], publishResult: null })}
        />
      </section>

      <section className="media-panel">
        <p className="eyebrow">02 · หลักฐาน</p>
        <label htmlFor="media-evidence">
          พาธหรือลิงก์ที่เปิดเอง เช่น <code>upstream/nirva-ai/shared/media.ts</code>
        </label>
        <textarea
          id="media-evidence"
          rows={4}
          value={piece.evidence}
          onChange={(event) => update({ evidence: event.target.value, status: "draft", publishResult: null })}
        />
        <p className={evidencePass ? "nowdo-next is-done" : "gate"}>
          {evidencePass
            ? "ประตูหลักฐานผ่าน ข้อความนี้ชี้ของที่เปิดตามได้"
            : "ยังไม่ผ่านประตูหลักฐาน ต้องยาวพอและมีพาธ ลิงก์ หรือชื่อไฟล์ต้นทาง"}
        </p>
      </section>

      <section className="media-panel">
        <p className="eyebrow">03 · สคริปต์ / สตอรี่บอร์ด</p>
        <label htmlFor="media-script">สคริปต์พูดหรือคำบรรยาย</label>
        <textarea
          id="media-script"
          rows={4}
          value={piece.script}
          onChange={(event) => update({ script: event.target.value, status: "draft", publishResult: null })}
        />
        <label htmlFor="media-board">สามจังหวะภาพ (เขียนเอง เพราะโมดูลสตอรี่บอร์ดต้นทางยังเป็น mock)</label>
        <textarea
          id="media-board"
          rows={3}
          value={piece.storyboard}
          onChange={(event) => update({ storyboard: event.target.value, status: "draft", publishResult: null })}
        />
      </section>

      <section className="media-panel">
        <p className="eyebrow">04 · ร่างสินทรัพย์ในเครื่องนี้</p>
        <p className="lede">จำลอง POST /api/campaigns โดยไม่เรียกเครือข่าย</p>
        <button type="button" className="btn primary" onClick={generate}>
          สร้างร่างสามช่องทาง
        </button>
        {piece.assets.length > 0 ? (
          <ul className="media-assets">
            {piece.assets.map((asset) => (
              <li key={asset.channel}>
                <strong>
                  {asset.channel} · {asset.format}
                </strong>
                <span>{asset.title}</span>
                <p>{asset.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="lede">ยังไม่มีร่าง</p>
        )}
      </section>

      <section className="media-panel">
        <p className="eyebrow">05 · คนตรวจ</p>
        <p className="lede">
          สถานะตอนนี้ <strong>{piece.status}</strong> · STATUS_FLOW ห้ามกระโดดไป published
        </p>
        <label className="media-check">
          <input
            type="checkbox"
            checked={piece.humanReviewed}
            onChange={(event) => update({ humanReviewed: event.target.checked, publishResult: null })}
          />
          ฉันอ่านร่างด้วยตาตนเอง เธอไม่ได้กดอนุมัติแทน
        </label>
        <div className="actions">
          <button type="button" className="btn ghost" onClick={sendReview} disabled={!readyReview}>
            ส่งตรวจ
          </button>
          <button type="button" className="btn primary" onClick={approveByHuman} disabled={!(piece.status === "review" && piece.humanReviewed)}>
            อนุมัติโดยคน
          </button>
        </div>
      </section>

      <section className="media-panel rubric" aria-labelledby="media-checklist-title">
        <p className="eyebrow">เช็คลิสต์</p>
        <h2 id="media-checklist-title">เกณฑ์ผ่านที่ตรวจเอง</h2>
        <ul>
          {CHECKLIST.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={piece.checklist.includes(item.id)}
                  onChange={() => toggleCheck(item.id)}
                />
                {item.text}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="media-panel">
        <p className="eyebrow">06 · ขอคิวเผยแพร่</p>
        <p className="lede">
          แล็บนี้ไม่ยิงระบบจริง ผลที่ถูกต้องคือ <code>blocked_auth</code> เหมือน{" "}
          <code>app/api/publish-jobs/route.ts</code>
        </p>
        <div className="actions">
          <button type="button" className="btn primary" onClick={askQueue}>
            ขอคิวเผยแพร่หลังคนอนุมัติ
          </button>
          <button type="button" className="btn ghost" onClick={trapAuto}>
            ให้เธอเผยแพร่เลย
          </button>
        </div>
        {piece.publishResult ? (
          <p className={piece.publishResult.published ? "gate" : "nowdo-next is-done"} role="status">
            {piece.publishResult.code}
            {piece.publishResult.published ? " · published" : " · ไม่ได้เผยแพร่"} · {piece.publishResult.message}
          </p>
        ) : null}
      </section>

      {notice ? (
        <p className="save-hint" role="status">
          {notice}
        </p>
      ) : null}

      <section className="media-sources">
        <p className="eyebrow">แหล่งที่ reuse ได้</p>
        <ul>
          {pipeline.reuse.map((stage) => (
            <li key={stage.id}>
              <strong>{stage.title_th}</strong>
              <span> {stage.academy_action}</span>
              <ul>
                {stage.files.map((file) => (
                  <li key={file}>
                    <code>{file}</code>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="media-missing">
        <p className="eyebrow">ของที่ยังหา source ไม่พบ</p>
        <ul>
          {pipeline.missing_sources.map((item) => (
            <li key={item.id}>
              <strong>{item.asked}</strong>
              <p>{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="note">
        บทเรียนอยู่ที่ <TrackedLink href="/learn/media-lab">Nirva Media Lab</TrackedLink> · รูบริกที่{" "}
        <TrackedLink href="/lab/media-lab">แล็บชิ้นงาน</TrackedLink>
      </p>
    </div>
  );
}
