import { ContentMarkdown } from "@/components/ContentMarkdown";
import { ShopTests } from "@/components/ShopTests";
import { shopReadme, shopSource } from "@/lib/curriculum";

export default function ShopPage() {
  return (
    <>
      <header className="lesson-head">
        <p className="kicker">ของจริงให้ลงมือ</p>
        <h1>ร้านค้าตัวอย่าง</h1>
      </header>
      <ContentMarkdown markdown={shopReadme()} />
      <ShopTests />
      <h2 className="prose" style={{ color: "var(--gold)" }}>
        price.js ตอนนี้
      </h2>
      <div className="prose">
        <pre>
          <code>{shopSource("price.js")}</code>
        </pre>
      </div>
    </>
  );
}
