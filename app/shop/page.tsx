import { MarkdownBody } from "@/components/MarkdownBody";
import { ShopTests } from "@/components/ShopTests";
import { shopReadme, shopSource } from "@/lib/curriculum";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track = "cursor" } = await searchParams;

  return (
    <>
      <header className="lesson-head">
        <p className="kicker">ของจริงให้ลงมือ</p>
        <h1>ร้านค้าตัวอย่าง</h1>
      </header>
      <MarkdownBody markdown={shopReadme()} track={track} />
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
