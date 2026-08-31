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
          Nirva Media ไม่ใช่แทร็กที่ห้า เป็นแล็บประยุกต์ที่{" "}
          <TrackedLink href="/media">Nirva Media Lab</TrackedLink>
        </p>
      </header>
      <TrackCompare tracks={tracks} />
    </>
  );
}
