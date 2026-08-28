"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/lib/curriculum";
import type { MediaCampaign, MediaPipeline } from "@/lib/media-lab";
import {
  CHECKLISTS,
  LESSON_IDS,
  RUBRIC,
  applySyntheticCampaign,
  attemptAutoPublish,
  briefStageOk,
  buildLocalDrafts,
  canEnterReview,
  canOpenLesson,
  evidenceBoardOk,
  migratePiece,
  moveStatus,
  nextLessonId,
  requestPublish,
  scriptStageOk,
  stageComplete,
  type MediaPiece,
} from "@/lib/media-lab-gates";
import { TrackedLink, useTrackId } from "@/components/TrackSwitch";
import { MEDIA_LAB_KEY, PROGRESS_EVENT, readDone, writeJson } from "@/lib/progress";

const LESSON_HREF: Record<string, string> = {
  "media-brief-evidence": "/learn/media-brief-evidence",
  "media-script-storyboard": "/learn/media-script-storyboard",
  "media-review-publish": "/learn/media-review-publish",
};

const LESSON_TITLE: Record<string, string> = {
  "media-brief-evidence": "Brief และกระดานหลักฐาน",
  "media-script-storyboard": "สคริปต์และสตอรี่บอร์ด",
  "media-review-publish": "คนตรวจและคิวถูกบล็อก",
};

function readPiece(): MediaPiece {
  if (typeof window === "undefined") return migratePiece(null);
  try {
    const raw = window.localStorage.getItem(MEDIA_LAB_KEY);
    return migratePiece(raw ? JSON.parse(raw) : null);
  } catch {
    return migratePiece(null);
  }
}

function savePiece(piece: MediaPiece) {
  writeJson(MEDIA_LAB_KEY, piece);
}

function useMediaPiece() {
  const [piece, setPiece] = useState<MediaPiece>(migratePiece(null));

  useEffect(() => {
    const sync = () => setPiece(readPiece());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  function update(patch: Partial<MediaPiece>) {
    const publishResult = Object.prototype.hasOwnProperty.call(patch, "publishResult")
      ? patch.publishResult ?? null
      : piece.publishResult;
    const next = migratePiece({ ...piece, ...patch, publishResult });
    setPiece(next);
    savePiece(next);
    return next;
  }

  return { piece, setPiece, update };
}

function TrackCoach({ tracks, lessonId }: { tracks: Track[]; lessonId: string }) {
  const trackId = useTrackId();
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const concept = track.concepts.find((item) => item.conceptId === lessonId);

  return (
    <aside className="media-track" aria-label={`คำสั่งแทร็ก ${track.name}`}>
      <p className="eyebrow">แทร็กเครื่องมือ · ไม่ใช่แท็บ Media</p>
      <h2>ทำตอนนี้ด้วย {track.name}</h2>
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
  );
}

export function MediaHub({
  pipeline,
  campaign,
  tracks,
}: {
  pipeline: MediaPipeline;
  campaign: MediaCampaign;
  tracks: Track[];
}) {
  const { piece, update } = useMediaPiece();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const resumeId = nextLessonId(done.filter((id) => LESSON_IDS.includes(id)));
  const mediaDone = LESSON_IDS.filter((id) => done.includes(id));

  return (
    <div className="media-lab">
      <p className="media-local" role="status">
        สถานะนี้อยู่ในเบราว์เซอร์นี้เท่านั้น ไม่ซิงก์ Studio จริง ไม่เก็บซีเคร็ต
      </p>

      <TrackCoach tracks={tracks} lessonId={resumeId} />

      <nav aria-label="ลำดับตอน Nirva Media Lab">
        <ol className="media-progress">
          {LESSON_IDS.map((id, index) => {
            const complete = done.includes(id) || stageComplete(piece, id);
            const locked = !canOpenLesson(id, mediaDone) && !complete;
            const current = resumeId === id;
            return (
              <li key={id} aria-current={current ? "step" : undefined}>
                <p className="eyebrow">ตอนที่ {index + 1}</p>
                <h2>{LESSON_TITLE[id]}</h2>
                <p className="lede">
                  {complete ? "ผ่านในเครื่องนี้" : locked ? "ยังไม่ถึงตอนนี้" : "พร้อมลงมือ"}
                </p>
                {locked ? (
                  <p className="gate">ผ่านตอนก่อนหน้าก่อนจึงเปิดแผ่นงานนี้</p>
                ) : (
                  <TrackedLink className="btn ghost" href={LESSON_HREF[id]}>
                    {complete ? "ทบทวนตอนนี้" : "เรียนตอนนี้"}
                  </TrackedLink>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <p className="actions">
        <TrackedLink className="btn huge" href={LESSON_HREF[resumeId]}>
          {mediaDone.length === 0 ? "เริ่มตอนที่ ๑" : mediaDone.length === 3 ? "ทบทวนเส้นทาง" : `เรียนต่อ · ${LESSON_TITLE[resumeId]}`}
        </TrackedLink>
      </p>

      <section className="media-panel" aria-labelledby="campaign-title">
        <p className="eyebrow">ตัวอย่างสังเคราะห์</p>
        <h2 id="campaign-title">{campaign.title_th}</h2>
        <p className="lede">{campaign.warning}</p>
        <button
          type="button"
          className="btn ghost"
          onClick={() => update(applySyntheticCampaign(campaign))}
        >
          เติมตัวอย่างลงแผ่นงานในเครื่องนี้
        </button>
        <p className="save-hint">ตัวอย่างนี้ไม่ใช่ลูกค้าจริง แก้ให้เป็นงานตนเองก่อนถือว่าจบ</p>
      </section>

      <section className="media-sources" aria-labelledby="source-title">
        <h2 id="source-title">แหล่งที่ reuse ได้</h2>
        <ul>
          {pipeline.reuse.map((stage) => (
            <li key={stage.id}>
              <strong>{stage.title_th}</strong>
              <span> {stage.academy_action}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="media-missing" aria-labelledby="authored-title">
        <h2 id="authored-title">แบบฝึกของ Academy และของที่ยังไม่พบ</h2>
        <ul>
          {(pipeline.academy_authored ?? []).map((item) => (
            <li key={item.id}>
              <p>{item.note}</p>
            </li>
          ))}
          {pipeline.missing_sources.map((item) => (
            <li key={item.id}>
              <strong>{item.asked}</strong>
              <p>{item.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FieldList<T extends Record<string, string>>({
  rows,
  keys,
  labels,
  onChange,
}: {
  rows: T[];
  keys: (keyof T)[];
  labels: string[];
  onChange: (rows: T[]) => void;
}) {
  return (
    <ul className="media-board">
      {rows.map((row, index) => (
        <li key={`${String(keys[0])}-${index}`}>
          {"beat" in row && row.beat ? <p className="eyebrow">{String(row.beat)}</p> : null}
          {keys.map((key, keyIndex) => (
            <label key={String(key)}>
              {labels[keyIndex]} {index + 1}
              <textarea
                rows={2}
                value={row[key] ?? ""}
                onChange={(event) => {
                  const next = rows.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, [key]: event.target.value } : item,
                  );
                  onChange(next);
                }}
              />
            </label>
          ))}
        </li>
      ))}
    </ul>
  );
}

export function MediaStage({
  lessonId,
  tracks,
  campaign,
}: {
  lessonId: string;
  tracks: Track[];
  campaign?: MediaCampaign;
}) {
  const { piece, setPiece, update } = useMediaPiece();
  const [done, setDone] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const mediaDone = done.filter((id) => LESSON_IDS.includes(id));
  const locked = !canOpenLesson(lessonId, mediaDone);
  const items = CHECKLISTS[lessonId] ?? [];

  const evidencePass = evidenceBoardOk(piece);
  const briefPass = briefStageOk(piece);
  const scriptPass = scriptStageOk(piece);

  function toggleCheck(id: string) {
    const current = piece.checklists[lessonId] ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    update({ checklists: { ...piece.checklists, [lessonId]: next } });
  }

  function sendReview() {
    const result = moveStatus(piece, "review");
    setNotice(result.ok ? "ส่งตรวจแล้ว คนต้องอ่านก่อนอนุมัติ" : "ยังเข้า review ไม่ได้ ต้องผ่าน brief และสคริปต์");
    if (result.ok) {
      setPiece(result.piece);
      savePiece(result.piece);
    }
  }

  function approveByHuman() {
    const result = moveStatus({ ...piece, humanReviewed: true }, "approved");
    if (!result.ok) {
      setNotice("อนุมัติได้เมื่อสถานะเป็น review คนอ่านเอง และรูบริกครบ");
      return;
    }
    const next = { ...result.piece, humanReviewed: true };
    setNotice("คนอนุมัติแล้ว ยังห้ามให้เธอเผยแพร่");
    setPiece(next);
    savePiece(next);
  }

  if (locked) {
    return (
      <p className="gate">
        ผ่านตอนก่อนหน้าก่อน จึงเปิดแผ่นงานนี้ · <TrackedLink href="/media">กลับฮับ</TrackedLink>
      </p>
    );
  }

  return (
    <div className="media-lab">
      <TrackCoach tracks={tracks} lessonId={lessonId} />

      {lessonId === "media-brief-evidence" ? (
        <>
          <section className="media-panel" aria-labelledby="brief-title">
            <h2 id="brief-title">เป้า ผู้ชม และ brief</h2>
            <label htmlFor="media-goal">เป้าหมายชิ้นงาน</label>
            <textarea id="media-goal" rows={3} value={piece.goal} onChange={(event) => update({ goal: event.target.value, status: "draft" })} />
            <label htmlFor="media-audience">ผู้ชม</label>
            <textarea id="media-audience" rows={3} value={piece.audience} onChange={(event) => update({ audience: event.target.value, status: "draft" })} />
            <label htmlFor="media-brief">Brief รวมโทนและสิ่งห้าม</label>
            <textarea id="media-brief" rows={5} value={piece.brief} onChange={(event) => update({ brief: event.target.value, status: "draft" })} />
          </section>
          <section className="media-panel" aria-labelledby="evidence-title">
            <h2 id="evidence-title">กระดานหลักฐาน</h2>
            <label htmlFor="media-evidence">พาธหรือลิงก์ที่เปิดเอง</label>
            <textarea id="media-evidence" rows={3} value={piece.evidence} onChange={(event) => update({ evidence: event.target.value, status: "draft" })} />
            <p className={evidencePass ? "nowdo-next is-done" : "gate"}>
              {evidencePass ? "ประตูหลักฐานผ่าน" : "ยังไม่ผ่าน ต้องมีแหล่งในข้อเท็จจริง และเหตุผลในสมมติฐาน"}
            </p>
            <h3>ข้อเท็จจริง</h3>
            <FieldList
              rows={piece.facts}
              keys={["claim", "source"]}
              labels={["คำอ้าง", "แหล่ง"]}
              onChange={(facts) => update({ facts, status: "draft" })}
            />
            <h3>สมมติฐาน</h3>
            <FieldList
              rows={piece.assumptions}
              keys={["claim", "why"]}
              labels={["คำเดา", "ทำไมยังไม่วัด"]}
              onChange={(assumptions) => update({ assumptions, status: "draft" })}
            />
          </section>
        </>
      ) : null}

      {lessonId === "media-script-storyboard" ? (
        <>
          {!briefPass ? <p className="gate">ตอน brief ยังไม่ครบ กลับไปล็อกกระดานหลักฐานก่อน</p> : null}
          <section className="media-panel" aria-labelledby="script-title">
            <h2 id="script-title">สคริปต์สามช่องทาง</h2>
            <label htmlFor="script-line">LINE OA</label>
            <textarea id="script-line" rows={4} value={piece.scripts.line} onChange={(event) => update({ scripts: { ...piece.scripts, line: event.target.value }, status: "draft" })} />
            <label htmlFor="script-ig">Instagram</label>
            <textarea id="script-ig" rows={4} value={piece.scripts.instagram} onChange={(event) => update({ scripts: { ...piece.scripts, instagram: event.target.value }, status: "draft" })} />
            <label htmlFor="script-yt">YouTube</label>
            <textarea id="script-yt" rows={4} value={piece.scripts.youtube} onChange={(event) => update({ scripts: { ...piece.scripts, youtube: event.target.value }, status: "draft" })} />
          </section>
          <section className="media-panel" aria-labelledby="board-title">
            <h2 id="board-title">สตอรี่บอร์ด · แบบฝึกของ Academy</h2>
            <p className="lede">ไม่ใช่ฟีเจอร์ runtime ที่พบใน NirvaMedia มีเพียงคำใน mock-data</p>
            <FieldList
              rows={piece.storyboard}
              keys={["visual", "audio", "note"]}
              labels={["ภาพ", "เสียง", "หมายเหตุ"]}
              onChange={(storyboard) => update({ storyboard, storyboardSource: "academy-worksheet", status: "draft" })}
            />
            <button
              type="button"
              className="btn primary"
              onClick={() =>
                update({
                  assets: buildLocalDrafts(piece.brief, piece.scripts),
                  status: piece.status === "archived" ? "draft" : piece.status,
                })
              }
            >
              สร้างร่างสามช่องทางในเครื่องนี้
            </button>
            {piece.assets.length > 0 ? (
              <ul className="media-assets">
                {piece.assets.map((asset) => (
                  <li key={asset.channel}>
                    <strong>
                      {asset.channel} · {asset.format}
                    </strong>
                    <p>{asset.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="lede">ยังไม่มีร่าง</p>
            )}
            <p className={scriptPass ? "nowdo-next is-done" : "gate"}>
              {scriptPass ? "สคริปต์และแบบฝึกครบ" : "ต้องมีสคริปต์ครบ แบบฝึกสามจังหวะ และร่างในเครื่องนี้"}
            </p>
          </section>
        </>
      ) : null}

      {lessonId === "media-review-publish" ? (
        <>
          {!canEnterReview(piece) ? <p className="gate">ยังส่งตรวจไม่ได้ จบตอน brief และสคริปต์ก่อน</p> : null}
          <section className="media-panel rubric" aria-labelledby="rubric-title">
            <h2 id="rubric-title">รูบริกคุณภาพและความเสี่ยง</h2>
            <ul>
              {RUBRIC.map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={piece.rubric.includes(item.id)}
                      onChange={() => {
                        const rubric = piece.rubric.includes(item.id)
                          ? piece.rubric.filter((id) => id !== item.id)
                          : [...piece.rubric, item.id];
                        update({ rubric, publishResult: null });
                      }}
                    />
                    {item.text}
                  </label>
                </li>
              ))}
            </ul>
            <p className="lede">
              สถานะตอนนี้ <strong>{piece.status}</strong>
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
              <button type="button" className="btn ghost" onClick={sendReview} disabled={!canEnterReview(piece)}>
                ส่งตรวจ
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={approveByHuman}
                disabled={!(piece.status === "review" && piece.humanReviewed)}
              >
                อนุมัติโดยคน
              </button>
            </div>
          </section>
          <section className="media-panel" aria-labelledby="queue-title">
            <h2 id="queue-title">คิวจำลอง</h2>
            <p className="lede">ผลที่ถูกคือ <code>blocked_auth</code> ไม่ใช่ published</p>
            <div className="actions">
              <button type="button" className="btn primary" onClick={() => {
                const result = requestPublish(piece);
                update({ publishResult: result });
                setNotice(result.message);
              }}>
                ขอคิวเผยแพร่หลังคนอนุมัติ
              </button>
              <button type="button" className="btn ghost" aria-describedby="auto-help" onClick={() => {
                const result = attemptAutoPublish(piece);
                update({ publishResult: result });
                setNotice(result.message);
              }}>
                ให้เธอเผยแพร่เลย
              </button>
            </div>
            <p id="auto-help" className="save-hint">ปุ่มนี้ต้องล้มเสมอ ใช้สอนว่าเธอห้ามโพสต์แทนคน</p>
            {piece.publishResult ? (
              <p className={piece.publishResult.published ? "gate" : "nowdo-next is-done"} role="status">
                {piece.publishResult.code}
                {piece.publishResult.published ? " · published" : " · ไม่ได้เผยแพร่"} · {piece.publishResult.message}
              </p>
            ) : null}
            <label htmlFor="postmortem">Postmortem</label>
            <textarea id="postmortem" rows={4} value={piece.postmortem} onChange={(event) => update({ postmortem: event.target.value })} />
          </section>
        </>
      ) : null}

      <section className="media-panel rubric" aria-labelledby={`check-${lessonId}`}>
        <h2 id={`check-${lessonId}`}>เช็คลิสต์ตอนนี้</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={(piece.checklists[lessonId] ?? []).includes(item.id)}
                  onChange={() => toggleCheck(item.id)}
                />
                {item.text}
              </label>
            </li>
          ))}
        </ul>
      </section>

      {notice ? (
        <p className="save-hint" role="status">
          {notice}
        </p>
      ) : null}

      {campaign && lessonId === "media-brief-evidence" ? (
        <p className="note">
          ตัวอย่างสังเคราะห์: {campaign.title_th} · เติมได้จาก <TrackedLink href="/media">ฮับ</TrackedLink>
        </p>
      ) : (
        <p className="note">
          ดูลำดับทั้งเส้นที่ <TrackedLink href="/media">Nirva Media Lab</TrackedLink>
        </p>
      )}
    </div>
  );
}
