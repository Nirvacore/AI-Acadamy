# Nirva Academy Learning Center Foundation

## Purpose

เปลี่ยนหน้าแรกของ Nirva Academy จากหน้ารวมคอร์สยาวให้เป็นศูนย์การเรียนรู้ที่ผู้ใช้เริ่มเรียนต่อได้ทันที โดยรักษาบทเรียน แล็บ ความคืบหน้า และเส้นทางเดิมทั้งหมดไว้

## Scope for this slice

- หน้าแรกมีสี่ฮับ: เส้นทางเรียน, ฝึกปฏิบัติ, สำรวจความรู้, และความก้าวหน้า
- ปุ่มหลักคำนวณบทถัดไปจาก local-first progress เดิม
- เดสก์ท็อปเห็นเมนู ค้นหา ตัวเลือกแทร็ก และความคืบหน้าโดยไม่ต้องเปิด disclosure
- มือถือยังยุบเมนูได้เหมือนเดิม
- Nirva Academy เป็นเจ้าของประสบการณ์เรียน ส่วน Nirva Media ปรากฏเป็นกรณีศึกษา และ Nirva AI เป็นระบบอีกผลิตภัณฑ์หนึ่ง
- CTA หลักอยู่ภายใน Academy; แหล่งเรียนภายนอกเป็นข้อมูลเสริมเท่านั้น

## Non-goals

- ไม่สร้างบัญชีหรือการซิงก์หลายเครื่อง
- ไม่ต่อ AI Coach จริงหรือส่งข้อมูลผู้เรียนไปยังโมเดล
- ไม่ย้ายเนื้อหา Nirva Media ไปยัง repository อื่นในรอบนี้
- ไม่ merge, deploy, แก้ DNS, secrets, GitHub Pages หรือ production route
- ไม่เปลี่ยน product registry หรือคิด product code ใหม่

## Information architecture

หน้าแรกเรียงลำดับดังนี้:

1. **เรียนต่อ** — ปุ่มเดียวไปบทถัดไป พร้อมข้อความ local-first
2. **สี่ฮับ**
   - เส้นทางเรียน: ชั่วโมงแรกและบทแกน
   - ฝึกปฏิบัติ: แล็บและงานประยุกต์
   - สำรวจความรู้: หลักสูตร แทร็ก และอภิธานศัพท์
   - ความก้าวหน้า: ผลการเรียน สมุดสะท้อน และเกียรติบัตร
3. **แดชบอร์ดและรายการเต็ม** — เก็บไว้ใน disclosure สำหรับคนที่ต้องการรายละเอียด

## Component boundary

- `components/LearningCenterHome.tsx` เป็น client component อ่าน progress เดิมและสร้าง UI หน้าแรก
- `app/page.tsx` โหลด catalog/schema ฝั่ง server แล้วส่งข้อมูลเข้า component
- `components/Shell.tsx` แบ่ง navigation เป็น `เรียน`, `ฝึก`, `สำรวจ`, `ความก้าวหน้า`, และ `กรณีศึกษา`
- `app/globals.css` เพิ่มเฉพาะ style ของ Learning Center และคง breakpoint เดิมที่ 980px
- tests ตรวจ static export, internal CTA, product wording, hub labels และ desktop/mobile navigation contract

## State and privacy

ใช้ key และ helper ใน `lib/progress.ts` เดิมเท่านั้น ไม่มี state schema ใหม่ใน slice นี้ ความก้าวหน้ายังคงอยู่ใน browser และไม่ส่งไปยัง AI หรือ server

## Accessibility

- ใช้ heading ตามลำดับและ landmark ที่มีชื่อ
- ฮับเป็นลิงก์ที่มีคำอธิบาย ไม่ใช้ card ที่คลิกได้ด้วย JavaScript
- focus style เดิมต้องยังมองเห็น
- เมนูมือถือใช้ native `details/summary`; เดสก์ท็อปบังคับแสดงเนื้อหา
- เคารพ `prefers-reduced-motion`

## Acceptance criteria

- `npm run build` สร้าง static export ครบ
- `npm test` ผ่านทั้งหมด
- หน้า `/` มีคำว่า `ศูนย์การเรียนรู้`, `เส้นทางเรียน`, `ฝึกปฏิบัติ`, `สำรวจความรู้`, `ความก้าวหน้า`
- CTA หน้าแรกที่เป็นจุดเริ่มต้นชี้ route ภายใน Nirva Academy
- หน้าแรกอธิบายชัดว่า Nirva Media เป็นกรณีศึกษา ไม่ใช่ Nirva Academy หรือ Nirva AI
- CSS เดสก์ท็อปแสดง `.rail-body`; CSS มือถือยังยุบเมื่อ `details` ไม่เปิด
- ไม่มี deployment หรือ production mutation ในงานนี้
