"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "@/components/TrackSwitch";
import {
  normalizeLearnerChoice,
  recommendProfileAdjustment,
  type LearnerChoice,
  type LearnerPace,
  type LearnerPresentation,
  type LearnerSupport,
  type ProfileAdjustment,
  type TrialResult,
} from "@/lib/learner-profile";
import styles from "./LearnerProfileSetup.module.css";

const PROFILE_KEY = "ai-acadamy:learner-profile";

const presentationOptions: Array<{
  value: LearnerPresentation;
  label: string;
  description: string;
}> = [
  { value: "story", label: "เล่าเป็นภาพ", description: "เริ่มจากเรื่องใกล้ตัว แล้วค่อยเปิดศัพท์เทคนิค" },
  { value: "balanced", label: "สมดุล", description: "อธิบายแก่น ตัวอย่าง และขั้นตอนในสัดส่วนพอดี" },
  { value: "direct", label: "กระชับตรง", description: "เห็นหลักการและคำสั่งก่อน แล้วค่อยย้อนดูที่มา" },
];

const paceOptions: Array<{ value: LearnerPace; label: string; description: string }> = [
  { value: "calm", label: "ค่อยเป็นค่อยไป", description: "หนึ่งช่วงสั้นต่อครั้ง มีเวลาทบทวน" },
  { value: "steady", label: "สม่ำเสมอ", description: "หนึ่งบทพร้อมแบบฝึกในแต่ละรอบ" },
  { value: "intensive", label: "เข้มข้น", description: "เดินหลายช่วงต่อเนื่องเมื่อมีเวลา" },
];

const supportOptions: Array<{ value: LearnerSupport; label: string; description: string }> = [
  { value: "guided", label: "พาเดินทีละขั้น", description: "มีตัวอย่างและคำเตือนก่อนลงมือ" },
  { value: "standard", label: "ช่วยเมื่อจำเป็น", description: "มีโครงให้ แต่เว้นพื้นที่ให้ลองเอง" },
  { value: "light", label: "ให้ฉันลองก่อน", description: "แสดงโจทย์และเกณฑ์ แล้วค่อยเปิดคำใบ้" },
];

type StoredProfile = {
  v: 1;
  selected: LearnerChoice;
  applied: LearnerChoice;
  trialResult: TrialResult;
  evidenceAnswerCorrect: boolean;
  updatedAt: string;
};

function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: Array<{ value: T; label: string; description: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label className={value === option.value ? `${styles.option} ${styles.selected}` : styles.option} key={option.value}>
            <input
              checked={value === option.value}
              name={name}
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            <span>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LearnerProfileSetup() {
  const [choice, setChoice] = useState<LearnerChoice>(() => normalizeLearnerChoice());
  const [answer, setAnswer] = useState("");
  const [felt, setFelt] = useState<TrialResult>("right");
  const [adjustment, setAdjustment] = useState<ProfileAdjustment | null>(null);
  const [saved, setSaved] = useState<StoredProfile | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<StoredProfile>;
      const applied = normalizeLearnerChoice(parsed.applied);
      setChoice(applied);
      setSaved({
        v: 1,
        selected: normalizeLearnerChoice(parsed.selected),
        applied,
        trialResult: parsed.trialResult ?? "right",
        evidenceAnswerCorrect: Boolean(parsed.evidenceAnswerCorrect),
        updatedAt: parsed.updatedAt ?? "",
      });
    } catch {
      window.localStorage.removeItem(PROFILE_KEY);
    }
  }, []);

  const answerCorrect = answer === "open-evidence";
  const effectiveTrial = useMemo<TrialResult>(
    () => (answer && !answerCorrect ? "too-hard" : felt),
    [answer, answerCorrect, felt],
  );

  const updateChoice = <K extends keyof LearnerChoice>(key: K, value: LearnerChoice[K]) => {
    setChoice((current) => ({ ...current, [key]: value }));
    setAdjustment(null);
  };

  const evaluate = () => {
    if (!answer) return;
    setAdjustment(recommendProfileAdjustment(choice, effectiveTrial));
  };

  const saveProfile = (applied: LearnerChoice) => {
    const profile: StoredProfile = {
      v: 1,
      selected: normalizeLearnerChoice(choice),
      applied: normalizeLearnerChoice(applied),
      trialResult: effectiveTrial,
      evidenceAnswerCorrect: answerCorrect,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setChoice(profile.applied);
    setSaved(profile);
  };

  return (
    <section className={styles.root} aria-labelledby="profile-title">
      <header className="lesson-head">
        <p className="eyebrow">ตัวเลือกเสริม · local-first</p>
        <h1 id="profile-title">เลือกวิธีเรียนของฉัน</h1>
        <p className="lede">
          หน้านี้ไม่ได้วัดอายุหรือบอกว่าคุณเก่งแค่ไหน คุณเลือกจังหวะด้วยตนเอง แล้วใช้แบบลองสั้นเพื่อดูว่า
          ควรเพิ่มหรือลดตัวช่วยหรือไม่
        </p>
        <p className={styles.privacy}>ข้อมูลอยู่ในเบราว์เซอร์นี้ ไม่ถูกส่งไปให้ AI และข้ามหน้านี้ได้เสมอ</p>
      </header>

      {saved ? (
        <aside className="outcome" role="status">
          บันทึกวิธีเรียนในเครื่องนี้แล้ว คุณเปลี่ยนใหม่ได้ทุกเมื่อ
        </aside>
      ) : null}

      <div className={`${styles.panel} ${styles.form}`}>
        <p className="eyebrow">1 · เลือกเองก่อน</p>
        <ChoiceGroup
          legend="อยากให้บทอธิบายแบบไหน"
          name="presentation"
          onChange={(value) => updateChoice("presentation", value)}
          options={presentationOptions}
          value={choice.presentation}
        />
        <ChoiceGroup
          legend="จังหวะเรียนที่เหมาะกับวันนี้"
          name="pace"
          onChange={(value) => updateChoice("pace", value)}
          options={paceOptions}
          value={choice.pace}
        />
        <ChoiceGroup
          legend="อยากได้ตัวช่วยมากแค่ไหน"
          name="support"
          onChange={(value) => updateChoice("support", value)}
          options={supportOptions}
          value={choice.support}
        />
      </div>

      <div className={`${styles.panel} ${styles.trial}`}>
        <p className="eyebrow">2 · แบบลองสั้น</p>
        <h2>เอเจนต์บอกว่า “สร้างรายงานไว้แล้ว” แต่ไม่ให้ลิงก์หรือพาธ คุณทำอะไรก่อน?</h2>
        <fieldset>
          <legend>เลือกหนึ่งคำตอบ</legend>
          {[
            ["trust", "เชื่อก่อน เพราะประโยคฟังมั่นใจ"],
            ["open-evidence", "ขอพาธหรือหลักฐาน แล้วเปิดตรวจด้วยตนเอง"],
            ["repeat", "ถามประโยคเดิมซ้ำจนได้คำตอบที่ชอบ"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                checked={answer === value}
                name="evidence-trial"
                onChange={() => {
                  setAnswer(value);
                  setAdjustment(null);
                }}
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>โจทย์นี้รู้สึกอย่างไร</legend>
          {[
            ["too-easy", "ง่ายไป"],
            ["right", "พอดี"],
            ["too-hard", "ยากไป"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                checked={felt === value}
                name="trial-feeling"
                onChange={() => {
                  setFelt(value as TrialResult);
                  setAdjustment(null);
                }}
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <button className="btn primary" disabled={!answer} onClick={evaluate} type="button">
          ดูคำแนะนำ
        </button>
      </div>

      {adjustment ? (
        <aside className={styles.recommendation} aria-live="polite">
          <p className="eyebrow">3 · คุณเป็นคนยืนยัน</p>
          <h2>{answerCorrect ? "จับหลักฐานถูกทางแล้ว" : "รอบนี้ควรเพิ่มตัวช่วยก่อน"}</h2>
          <p>{adjustment.reason}</p>
          <p>
            ระบบไม่เปลี่ยนรูปแบบคำอธิบายหรือจังหวะที่คุณเลือก และจะไม่บันทึกจนกว่าคุณกดเอง
          </p>
          <div className="actions">
            <button className="btn primary" onClick={() => saveProfile(adjustment.recommended)} type="button">
              ใช้คำแนะนำนี้
            </button>
            <button className="btn ghost" onClick={() => saveProfile(adjustment.selected)} type="button">
              คงตัวเลือกของฉัน
            </button>
          </div>
        </aside>
      ) : null}

      <div className="actions">
        <TrackedLink className="btn ghost" href="/start">
          ข้ามและเริ่มเรียน
        </TrackedLink>
        <TrackedLink className="btn ghost" href="/">
          กลับศูนย์การเรียนรู้
        </TrackedLink>
      </div>
    </section>
  );
}
