import Link from "next/link";

export default function NotFound() {
  return (
    <header className="lesson-head">
      <p className="kicker">ไม่พบหน้านี้</p>
      <h1>เส้นทางนี้ไม่มีในหลักสูตร</h1>
      <p className="lede">
        กลับไปที่ <Link href="/">หน้าแรก</Link> แล้วเลือกบทจากแถบซ้าย
      </p>
    </header>
  );
}
