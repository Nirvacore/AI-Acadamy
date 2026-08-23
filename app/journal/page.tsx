import { JournalIndex } from "@/components/Journal";

export default function JournalPage() {
  return (
    <>
      <header className="lesson-head">
        <p className="eyebrow">มือตนเอง</p>
        <h1>สมุดสะท้อน</h1>
        <p className="lede">
          รวมสิ่งที่เขียนในเบราว์เซอร์นี้ ห้ามวางให้เธอเรียบเรียงใหม่ ถ้าต้องการล้าง ให้ล้างข้อมูลเว็บไซต์
        </p>
      </header>
      <JournalIndex />
    </>
  );
}
