# AI-Acadamy

เรียนแนวคิดเอเจนต์จากแหล่งต้นฉบับ แล้วลงมือเป็นภาษาไทย

คอร์สนี้เขียนขึ้นใหม่เป็นไทย อิงโครง [Cursor Learn](https://cursor.com/learn) แต่**ไม่คัดลอก**บทอังกฤษมาพากย์ คัดลอกต้นฉบับมาทำวิดีโอไม่ได้ แต่ละบทจึงมีเนื้อหาไทยของตัวเอง แล็บที่ตรวจได้ และลิงก์ไปหน้าทางการให้อ่านคู่กัน

แทร็กแรกคือ Cursor แนวคิดเดียวกันสลับไป Claude, OpenAI หรือ GitHub Copilot ได้โดยไม่ต้องเรียนพื้นฐานใหม่

## วิธีเรียน

เรียนแทร็ก A ตามลำดับ อย่ากระโดดข้ามภาพหลอนกับคอนเท็กซ์

1. อ่านบทใน `content/core/`
2. เปิดแทร็กเครื่องมือใน `content/tracks/` แล้วหาปุ่มตาม `conceptId`
3. ทำแล็บใน `content/labs/` จนผ่านเกณฑ์
4. อ่านหน้าอังกฤษที่ท้ายบท เพื่อเทียบคำศัพท์บนจอจริง
5. ถ้าจะอัดคลิป ใช้สคริปต์ใน `content/scripts/th/`

เวลาต่อบทประมาณหนึ่งแล็บ บวกคลิปแปดถึงสิบสองนาทีเมื่อมีวิดีโอ

## สลับแทร็กบริษัท

ชั้นเรียนมีสามชั้น

| ชั้น | ของใคร | เปลี่ยนเมื่อไหร่ |
| --- | --- | --- |
| Core | ทุกคน | ไม่เปลี่ยนตามบริษัท |
| Adapter | ไฟล์ใน `content/tracks/` | เมื่อสลับเครื่องมือ |
| Lab | โจทย์ร่วม | เปลี่ยนเฉพาะขั้นตอนใน `labDelta` |

วิธีสลับ:

1. เรียนแนวคิดจากบท `core-*` ตามปกติ
2. เปิดไฟล์แทร็กที่ต้องการ เช่น [content/tracks/claude.yaml](content/tracks/claude.yaml)
3. หา `conceptId` เดียวกับบทนั้น
4. ทำแล็บเดิมด้วย `uiLabel` และ `labDelta` ของแทร็กนั้น

แทร็กที่มีรายละเอียดครบในเฟสนี้คือ Cursor แทร็กอื่นเป็นโครงแมปสำหรับเทียบและเติมในเฟส 2

| แทร็ก | ไฟล์ | แหล่งทางการ |
| --- | --- | --- |
| Cursor | [content/tracks/cursor.yaml](content/tracks/cursor.yaml) | [cursor.com/learn](https://cursor.com/learn) |
| Claude | [content/tracks/claude.yaml](content/tracks/claude.yaml) | [academy.claude.com](https://academy.claude.com) |
| OpenAI | [content/tracks/openai.yaml](content/tracks/openai.yaml) | [academy.openai.com](https://academy.openai.com) |
| Copilot | [content/tracks/copilot.yaml](content/tracks/copilot.yaml) | [Microsoft Learn Copilot](https://learn.microsoft.com/training/paths/copilot) |

## แทร็ก A — พื้นฐาน AI

| บท | เนื้อหา | แล็บ | สคริปต์วิดีโอ |
| --- | --- | --- | --- |
| โมเดลทำงานอย่างไร | [content/core/01-how-models-work.md](content/core/01-how-models-work.md) | [labs/01](content/labs/01-fast-vs-smart.md) | [สคริปต์](content/scripts/th/01-how-models-work.md) |
| ภาพหลอนและข้อจำกัด | [content/core/02-hallucinations.md](content/core/02-hallucinations.md) | [labs/02](content/labs/02-catch-hallucination.md) | [สคริปต์](content/scripts/th/02-hallucinations.md) |
| โทเคนและราคา | [content/core/03-tokens-pricing.md](content/core/03-tokens-pricing.md) | [labs/03](content/labs/03-prompt-size.md) | [สคริปต์](content/scripts/th/03-tokens-pricing.md) |
| คอนเท็กซ์ | [content/core/04-context.md](content/core/04-context.md) | [labs/04](content/labs/04-trim-context.md) | [สคริปต์](content/scripts/th/04-context.md) |
| การเรียกเครื่องมือ | [content/core/05-tool-calling.md](content/core/05-tool-calling.md) | [labs/05](content/labs/05-search-not-guess.md) | [สคริปต์](content/scripts/th/05-tool-calling.md) |
| เอเจนต์ | [content/core/06-agents.md](content/core/06-agents.md) | [labs/06](content/labs/06-delegate-one-task.md) | [สคริปต์](content/scripts/th/06-agents.md) |

โครงหลักสูตรทั้งชุดอยู่ที่ [content/schema.yaml](content/schema.yaml) คำแปลคงที่อยู่ที่ [content/glossary/th.md](content/glossary/th.md)

## แทร็ก B และวิดีโอจริง

แทร็กบีเป็นโครงในสคีมาแล้ว โปรเจกต์จบคือโค้ดส่วนลดร้านค้าตัวอย่าง ที่ [content/labs/capstone-discount-code.md](content/labs/capstone-discount-code.md)

สคริปต์วิดีโอแทร็กเอพร้อมอัด ไฟล์วิดีโอจริงยังไม่เก็บในรีโป เพราะไฟล์ใหญ่และยังไม่ล็อกสตูดิโอ

## โครงสร้าง

```text
content/
  schema.yaml           # โครงหลักสูตรและรหัสบท
  glossary/th.md        # คำศัพท์ไทย–อังกฤษ
  core/                 # บทแนวคิดร่วม ภาษาไทย
  labs/                 # โจทย์ร่วมและเฉลยแนวทาง
  scripts/th/           # สคริปต์วิดีโอภาษาพูดไทย
  tracks/               # อะแดปเตอร์แต่ละบริษัท
```

## รูปแบบบทเรียน

ทุกบทใช้หกส่วนเดียวกัน เพื่อทำคลิปและสลับแทร็กได้

1. เป้าหมายหนึ่งประโยค
2. แนวคิดแกน
3. เดโมเครื่องมือ
4. แล็บสิบถึงสิบห้านาที
5. กับดักที่พบบ่อย
6. อ่านต้นฉบับ

## สิทธิ์และการใช้ต้นฉบับ

- เนื้อหาในรีโปนี้เป็นต้นฉบับภาษาไทยสำหรับสอน
- ลิงก์ไป Cursor Learn และอาคาเดมีอื่นเพื่อให้อ่านแหล่งทางการ
- อย่าแปะข้อความจากหน้าทางการทั้งก้อนเข้ามาในบทไทย
- ชื่อผลิตภัณฑ์เป็นของเจ้าของแบรนด์นั้นๆ
