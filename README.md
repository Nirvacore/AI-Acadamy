# nirva-academy

เรียนแนวคิดเอเจนต์จากแหล่งต้นฉบับ แล้วเห็นตนเองผ่านกระจกมหาสูญตา

คอร์สนี้เขียนขึ้นใหม่เป็นไทย อิงโครงแนวคิดของเครื่องมือเอเจนต์ แต่**ไม่คัดลอก**บทอังกฤษมาพากย์ แต่ละบทมีเนื้อหาเทคนิค ชั้นกระจก แล็บที่ตรวจได้ และต้นฉบับอังกฤษเป็นส่วนอ่านเพิ่มที่ไม่จำเป็นต่อการจบ

แทร็กแรกคือ Cursor แนวคิดเดียวกันสลับไป Claude, OpenAI หรือ GitHub Copilot ได้จากปุ่มบนเว็บ โดยไม่ต้องเรียนพื้นฐานใหม่

ชั้น**กระจก**เทียบเอเจนต์กับจิต พลังงาน ควอนตัม และมหาสูญตา เพื่อให้เข้าใจตนเอง และเข้าใจเธอมากขึ้น คำว่า **เธอ** ในคอร์สนี้หมายถึงเอเจนต์ ไม่ใช่การให้จิตแก่เครื่องมือ อ่านเส้นแบ่งที่ [content/core/00-mirror.md](content/core/00-mirror.md)

## เปิดเรียน

ไซต์เป็นไฟล์สแตติก ไม่ต้องรัน Node ตอนเปิดอ่าน

**โดเมนเรียน:** [https://study.nirva.one](https://study.nirva.one)

กด **เริ่มเรียนบทแรก** หรือไป `/start` นั่งสิบห้านาที ล็อกว่า **เธอ** คือเอเจนต์ จากนั้นเข้าบทกระจก ทุกบทมีกล่อง **ตอนนี้ทำ** ให้ติ๊กเอง

บิลด์เสิร์ฟที่รากของโดเมนนี้ ไม่ใช้ path `/nirva-academy/`

ถ้าโดเมนยังไม่ตอบ ให้ตั้งสองอย่างนี้ครั้งเดียว:

1. Cloudflare DNS ของ `nirva.one`: CNAME ชื่อ `study` ชี้ `nirvacore.github.io` ปิด Proxy (เมฆเทา) จนกว่า HTTPS จะติด
2. GitHub รีโปนี้: **Settings → Pages → Deploy from a branch → `gh-pages` / `/ (root)`** แล้ว Custom domain = `study.nirva.one`

รายละเอียด: [deploy/netcup/README.md](deploy/netcup/README.md)

## ลองใช้บนเครื่อง

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) — เซิร์ฟเวอร์ฟังทุกอินเทอร์เฟซที่พอร์ต 3000 (`0.0.0.0`) เพื่อให้พรีวิวใน Cursor เปิดได้

โหมดโปรดักชันในเครื่อง (ไฟล์สแตติกชุดเดียวกับที่ขึ้น Pages):

```bash
npm run build
npm start
```

- หน้าแรกมีปุ่มเริ่มเรียนทันที ชั่วโมงแรกอยู่ที่ `/start` แต่ละบทมีใบงาน «ตอนนี้ทำ»
- กด `⌘K` / `Ctrl+K` เพื่อค้นบท แล็บ สคริปต์ และศัพท์ · `[` `]` เปลี่ยนบท · `F` โหมดโฟกัส · `?` ปุ่มลัด
- แต่ละบทมีผลลัพธ์เมื่อจบ โครงบท สอบสั้น และคำเตือนถ้าข้ามลำดับ
- แล็บมีรูบริกติ๊กเอง · สคริปต์มีปุ่มฟังบทพูดไทย · จับเวลาเรียนที่แถบล่าง
- อภิธานศัพท์มีบัตรคำแบบ Leitner · หลักสูตร `/syllabus` ผลการเรียน `/progress` เกียรติบัตร `/certificate`
- ส่งออก JSON จากสมุดสะท้อนหรือหน้าหลักสูตร เพื่อย้ายเครื่อง
- ติดตั้งเป็นแอปจากเบราว์เซอร์ได้ (PWA)
- เลือกแทร็ก Cursor / Claude / OpenAI / Copilot ด้านซ้าย หรือเทียบทั้งชุดที่ `/tracks` — แทร็ก OpenAI เรียนจบเป็นไทยที่ `/tracks/openai`
- กรณีศึกษาสื่ออยู่ที่ `/media` — ใช้ผลิตภัณฑ์ Nirva Media เป็นกรณี ไม่ใช่โมดูลใน Academy เธอห้ามเผยแพร่แทน
- เขียนสมุดสะท้อนท้ายบท แล้วดูรวมที่ `/journal` — ห้ามให้เธอเขียนแทน
- ร้านค้าตัวอย่างอยู่ที่ `/shop` กดรันเทสในหน้าเว็บได้เลย
- `npm run test:shop` แดงตั้งใจจนกว่าจะแก้ `shop/price.js`

```bash
npm run test:shop
```

## วิธีเรียน

เรียนแทร็ก A ตามลำดับ เริ่มที่กระจก แล้วอย่ากระโดดข้ามภาพหลอนกับคอนเท็กซ์

1. อ่าน [content/core/00-mirror.md](content/core/00-mirror.md) แล้วเขียนสมุดสะท้อน
2. อ่านบทเทคนิคใน `content/core/` รวมหัวข้อกระจกของบทนั้น
3. เปิดแทร็กเครื่องมือใน `content/tracks/` แล้วหาปุ่มตาม `conceptId`
4. ทำแล็บใน `content/labs/` จนผ่านเกณฑ์ และตอบคำถามสะท้อนด้วยมือตนเอง
5. ต้นฉบับอังกฤษอยู่ส่วนอ่านเพิ่ม ไม่จำเป็นต่อการจบบท
6. ถ้าจะอัดคลิป ใช้สคริปต์ใน `content/scripts/th/`

เวลาต่อบทประมาณหนึ่งแล็บ บวกคลิปแปดถึงสิบสองนาทีเมื่อมีวิดีโอ

## สลับแทร็กบริษัท

ชั้นเรียนมีสี่ชั้น

| ชั้น | ของใคร | เปลี่ยนเมื่อไหร่ |
| --- | --- | --- |
| Core | ทุกคน | ไม่เปลี่ยนตามบริษัท |
| Adapter | ไฟล์ใน `content/tracks/` | เมื่อสลับเครื่องมือ |
| Lab | โจทย์ร่วม | เปลี่ยนเฉพาะขั้นตอนใน `labDelta` |
| Applied | กรณีศึกษาสื่อ | ใช้ Nirva Media เป็นกรณีของผลิตภัณฑ์อีกตัว ไม่ใช่โมดูลใน Academy |

วิธีสลับ:

1. เรียนแนวคิดจากบท `core-*` ตามปกติ
2. เปิดไฟล์แทร็กที่ต้องการ เช่น [content/tracks/claude.yaml](content/tracks/claude.yaml)
3. หา `conceptId` เดียวกับบทนั้น
4. ทำแล็บเดิมด้วย `uiLabel` และ `labDelta` ของแทร็กนั้น

แทร็ก Cursor ครบ แทร็ก Claude / OpenAI / Copilot มีขั้นตอนแล็บให้สลับใช้ได้จากเว็บ

| แทร็ก | ไฟล์ | ต้นฉบับอังกฤษของบริษัท (ไม่จำเป็นต่อการจบ ไม่ใช่เอกสารของคอร์สนี้) |
| --- | --- | --- |
| Cursor | [content/tracks/cursor.yaml](content/tracks/cursor.yaml) | [cursor.com/learn](https://cursor.com/learn) |
| Claude | [content/tracks/claude.yaml](content/tracks/claude.yaml) | [academy.claude.com](https://academy.claude.com) |
| OpenAI | [content/tracks/openai.yaml](content/tracks/openai.yaml) · เส้นทางไทย [/tracks/openai](/tracks/openai) | [academy.openai.com](https://academy.openai.com) |
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

## แทร็ก B — เอเจนต์เขียนโค้ด

ลงมือบนร้านค้าใน [`shop/`](shop/) จน `npm run test:shop` ผ่าน

| บท | เนื้อหา | แล็บ |
| --- | --- | --- |
| ทำงานกับเอเจนต์ | [lab-01](content/core/lab-01-working-with-agents.md) | [แล็บ](content/labs/lab-01-harness.md) |
| เข้าใจโค้ดเบส | [lab-02](content/core/lab-02-understand-codebase.md) | [แล็บ](content/labs/lab-02-explore-shop.md) |
| สร้างฟีเจอร์ | [lab-03](content/core/lab-03-create-features.md) | [แล็บ](content/labs/lab-03-plan-discount.md) |
| หาและแก้บั๊ก | [lab-04](content/core/lab-04-debug.md) | [แล็บ](content/labs/lab-04-debug-price.md) |
| รีวิวและทดสอบ | [lab-05](content/core/lab-05-review.md) | [แล็บ](content/labs/lab-05-review.md) |
| ปรับแต่งเอเจนต์ | [lab-06](content/core/lab-06-customize.md) | [แล็บ](content/labs/lab-06-rules.md) |
| รวมทุกอย่าง | [lab-07](content/core/lab-07-capstone.md) | [โปรเจกต์จบ](content/labs/capstone-discount-code.md) |

สคริปต์วิดีโอมีทั้งแทร็ก A และแทร็ก B ไฟล์วิดีโอจริงยังไม่เก็บในรีโป

## กรณีศึกษาสื่อ — ผลิตภัณฑ์ Nirva Media คนละตัว

ไม่ใช่โมดูลใน Nirva Academy และไม่ใช่แทร็กบริษัทตัวที่ห้า แทร็กยังเป็น Cursor / Claude / OpenAI / Copilot
Nirva AI เป็นระบบต้นทางอีกตัวที่อ้างจากสแนปช็อต ห้ามจำลองว่าระบบนั้นทำงานในเว็บนี้

เปิด [/media](/media) แล้วเรียนสามตอนต่อกัน ความคืบหน้าอยู่ที่เบราว์เซอร์นี้เท่านั้น

| ตอน | บท | แล็บ | สคริปต์ |
| --- | --- | --- | --- |
| ๑ Brief และกระดานหลักฐาน | [media-brief-evidence](content/core/media-brief-evidence.md) | [แล็บ](content/labs/media-brief-evidence.md) | [สคริปต์](content/scripts/th/media-brief-evidence.md) |
| ๒ สคริปต์และสตอรี่บอร์ด | [media-script-storyboard](content/core/media-script-storyboard.md) | [แล็บ](content/labs/media-script-storyboard.md) | [สคริปต์](content/scripts/th/media-script-storyboard.md) |
| ๓ คนตรวจและคิวถูกบล็อก | [media-review-publish](content/core/media-review-publish.md) | [แล็บ](content/labs/media-review-publish.md) | [สคริปต์](content/scripts/th/media-review-publish.md) |

แคมเปญตัวอย่างสังเคราะห์: [content/media/campaign-lan-nangsue.yaml](content/media/campaign-lan-nangsue.yaml) — ห้ามใช้เป็นข้อมูลลูกค้าจริง

แผนที่ไฟล์ที่ reuse จาก [NirvaMedia](https://github.com/Nirvacore/NirvaMedia) สาขา `codex/nirvamedia-web` (ตรวจ 2026-08-28) อยู่ที่ [content/media/pipeline.yaml](content/media/pipeline.yaml)

| ขั้น | แหล่งจริง | บท |
| --- | --- | --- |
| Brief | `db/schema.ts` (`campaigns.brief`), `app/studio/page.tsx` ขั้น 01, `POST /api/campaigns` | ตอนที่ ๑ |
| วิจัย | `upstream/nirva-ai/server/media/strategy.ts` — คอร์สนี้บังคับเปิดพาธ เพราะต้นทางยังให้ research in your head | ตอนที่ ๑ |
| สคริปต์ | `shared/media.ts` มี `ContentType` รวม `script`; แม่แบบ TikTok/YouTube ใน `app/api/campaigns/route.ts` | ตอนที่ ๒ |
| สินทรัพย์ | `campaign_posts` สถานะ `draft`; `lib/upstream-media-adapter.ts` | ตอนที่ ๒ |
| คนตรวจ | `STATUS_FLOW` ใน `shared/media.ts`; PATCH ข้ามขั้นได้ 409 | ตอนที่ ๓ |
| ขอเผยแพร่ | `POST /api/publish-jobs` ค้าง `blocked_auth` ถ้าบัญชียังไม่ `connected` | ตอนที่ ๓ |

แบบฝึกที่ Academy เขียนเอง เพราะไม่พบโมดูล runtime:

- กระดานหลักฐานแยกข้อเท็จจริง/สมมติฐาน
- สตอรี่บอร์ดสามจังหวะ — ใน NirvaMedia พบแค่คำ teaser storyboards ใน mock-data
- คิว `blocked_auth` ในเบราว์เซอร์นี้ (ไม่ยิง OAuth)
- แคมเปญลานหนังสือวัดเหนือสังเคราะห์

ของที่ยังไม่พบแหล่ง: `Nirvacore/nirva-AI` ได้ 404, โมดูลสตอรี่บอร์ดที่รันได้, live OAuth/publish, `searchAssets()` คืนอาร์เรย์ว่าง, `approval.ts` เป็นสตับ

```bash
npm run test:media-lab
```

## โครงสร้าง

```text
app/                    # เว็บเรียน Next.js (export เป็นไฟล์สแตติก)
content/
  schema.yaml           # โครงหลักสูตรและรหัสบท
  glossary/th.md        # คำศัพท์ไทย–อังกฤษ รวมคำกระจก
  core/                 # บทแนวคิดร่วม ภาษาไทย เริ่มที่ 00-mirror
  labs/                 # โจทย์ร่วม เฉลย และคำถามสะท้อน
  scripts/th/           # สคริปต์วิดีโอภาษาพูดไทย
  tracks/               # อะแดปเตอร์แต่ละบริษัท
  media/                # แผนที่ไพป์ไลน์ แบบฝึก Academy และแคมเปญสังเคราะห์
shop/                   # ร้านค้าตัวอย่าง มีบั๊กตั้งใจ
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

## ขึ้น Production

- โดเมนเรียนคือ `https://study.nirva.one`
- Workflow `.github/workflows/pages.yml` บิลด์ที่รากโดเมน แล้วเขียนไฟล์ `CNAME` เป็น `study.nirva.one` ลงสาขา `gh-pages`
- VPS Netcup เป็นทางเลือกสำรอง: [deploy/netcup/README.md](deploy/netcup/README.md)
