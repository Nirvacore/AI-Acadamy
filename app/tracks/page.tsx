import { TrackCompare } from "@/components/TrackCompare";
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
        </p>
      </header>
      <TrackCompare tracks={tracks} />
    </>
  );
}
