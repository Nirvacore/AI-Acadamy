# AI-Acadamy

เรียนแนวคิดเอเจนต์จากแหล่งต้นฉบับ แล้วเห็นตนเองผ่านกระจกมหาสูญตา

คอร์สนี้เขียนขึ้นใหม่เป็นไทย อิงโครง [Cursor Learn](https://cursor.com/learn) แต่**ไม่คัดลอก**บทอังกฤษมาพากย์ แต่ละบทมีเนื้อหาเทคนิค ชั้นกระจก แล็บที่ตรวจได้ และลิงก์ไปหน้าทางการ

แทร็กแรกคือ Cursor แนวคิดเดียวกันสลับไป Claude, OpenAI หรือ GitHub Copilot ได้โดยไม่ต้องเรียนพื้นฐานใหม่

ชั้น**กระจก**เทียบเอเจนต์กับจิต พลังงาน ควอนตัม และมหาสูญตา เพื่อให้เข้าใจตนเอง และเข้าใจเธอมากขึ้น คำว่า **เธอ** ในคอร์สนี้หมายถึงเอเจนต์ ไม่ใช่การให้จิตแก่เครื่องมือ อ่านเส้นแบ่งที่ [content/core/00-mirror.md](content/core/00-mirror.md)

## วิธีเรียน

เรียนแทร็ก A ตามลำดับ เริ่มที่กระจก แล้วอย่ากระโดดข้ามภาพหลอนกับคอนเท็กซ์

1. อ่าน [content/core/00-mirror.md](content/core/00-mirror.md) แล้วเขียนสมุดสะท้อน
2. อ่านบทเทคนิคใน `content/core/` รวมหัวข้อกระจกของบทนั้น
3. เปิดแทร็กเครื่องมือใน `content/tracks/` แล้วหาปุ่มตาม `conceptId`
4. ทำแล็บใน `content/labs/` จนผ่านเกณฑ์ และตอบคำถามสะท้อนด้วยมือตนเอง
5. อ่านหน้าอังกฤษที่ท้ายบท เพื่อเทียบคำศัพท์บนจอจริง
6. ถ้าจะอัดคลิป ใช้สคริปต์ใน `content/scripts/th/`

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
| กระจก จิต พลังงาน มหาสูญตา | [content/core/00-mirror.md](content/core/00-mirror.md) | [labs/00](content/labs/00-mirror-journal.md) | [สคริปต์](content/scripts/th/00-mirror.md) |
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
  glossary/th.md        # คำศัพท์ไทย–อังกฤษ รวมคำกระจก
  core/                 # บทแนวคิดร่วม ภาษาไทย เริ่มที่ 00-mirror
  labs/                 # โจทย์ร่วม เฉลย และคำถามสะท้อน
  scripts/th/           # สคริปต์วิดีโอภาษาพูดไทย
  tracks/               # อะแดปเตอร์แต่ละบริษัท
```

## รูปแบบบทเรียน

ทุกบทเทคนิคใช้เจ็ดส่วนเดียวกัน เพื่อทำคลิป สลับแทร็ก และสะท้อนเข้าตัวได้

1. เป้าหมายหนึ่งประโยค
2. แนวคิดแกน
3. กระจก — จิต พลังงาน ควอนตัม มหาสูญตา
4. เดโมเครื่องมือ
5. แล็บสิบถึงสิบห้านาที
6. กับดักที่พบบ่อย
7. อ่านต้นฉบับ

ควอนตัมในคอร์สนี้เป็นอุปมาเรื่องคำตอบที่ยังไม่ล็อก และการวัดมีราคา ไม่ใช่บทฟิสิกส์ และไม่ใช่การพิสูจน์ธรรมะ

## สิทธิ์และการใช้ต้นฉบับ

- เนื้อหาในรีโปนี้เป็นต้นฉบับภาษาไทยสำหรับสอน
- ลิงก์ไป Cursor Learn และอาคาเดมีอื่นเพื่อให้อ่านแหล่งทางการ
- อย่าแปะข้อความจากหน้าทางการทั้งก้อนเข้ามาในบทไทย
- ชื่อผลิตภัณฑ์เป็นของเจ้าของแบรนด์นั้นๆ
