# Nirva Academy Adaptive Onboarding

## Goal

ให้ผู้เรียนเลือกรูปแบบการเรียนด้วยตนเอง แล้วใช้แบบลองสั้นเพื่อเสนอการปรับระดับตัวช่วย โดยเก็บข้อมูลใน browser และไม่จัดคนตามอายุ

## Decisions

- ตัวเลือกมีสามแกน: presentation, pace, support
- แบบลองสั้นตรวจนิสัยเปิดหลักฐาน และให้ผู้เรียนบอกความรู้สึกว่าง่าย พอดี หรือยาก
- ผลแบบลองเป็นคำแนะนำ ผู้เรียนเลือกใช้หรือคงตัวเลือกเดิมได้
- เก็บ `v: 1`, selected, applied, trialResult และ updatedAt ใน localStorage
- ไม่มี model call, account, sync, age inference หรือ diagnosis

## Acceptance

- `/profile` เปิดได้จาก static export
- ใช้ keyboard กับ radio และปุ่มได้
- refresh แล้วยังอ่านค่าที่บันทึกไว้ได้
- invalid persisted data กลับค่าเป็นกลาง
- ผู้เรียนใหม่ยังเริ่ม `/start` ได้โดยไม่ทำ onboarding
