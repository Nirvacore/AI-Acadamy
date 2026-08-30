import { TrackCompare } from "@/components/TrackCompare";
import { TrackedLink } from "@/components/TrackSwitch";
import { loadTracks } from "@/lib/curriculum";

export default function TracksPage() {
  const tracks = loadTracks();

  return (
    <>
      <header className="lesson-head">
        <p className="eyebrow">อะแดปเตอร์</p>
        <h1>เทียบแทร็กบริษัท</h1>
        <p className="lede">
          แนวคิดร่วมคงที่ เปลี่ยนเฉพาะปุ่มและขั้นตอน เลือกแทร็กด้านซ้ายแล้วย้อนไปทำแล็บเดิมได้
          แทร็ก OpenAI เรียนจบเป็นไทยที่{" "}
          <TrackedLink href="/tracks/openai">เส้นทาง OpenAI ใน Nirva Academy</TrackedLink>
          โดยไม่ต้องสมัคร academy.openai.com Nirva Media เป็นกรณีศึกษาของผลิตภัณฑ์อีกตัวที่{" "}
          <TrackedLink href="/media">กรณีศึกษาสื่อ</TrackedLink> ไม่ใช่โมดูลใน Academy
        </p>
      </header>
      <TrackCompare tracks={tracks} />
    </>
  );
}
