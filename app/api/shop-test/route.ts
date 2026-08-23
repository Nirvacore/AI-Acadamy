import { createRequire } from "node:module";
import { NextResponse } from "next/server";

const require = createRequire(import.meta.url);

function loadPrice() {
  return require("../../../shop/price.js") as {
    netPrice: (input: { unitPrice: number; qty: number; couponPercent?: number }) => number;
  };
}

function expected(input: { unitPrice: number; qty: number; couponPercent?: number }) {
  const couponPercent = input.couponPercent || 0;
  let total = input.unitPrice * input.qty;
  if (couponPercent) {
    total = total * (1 - couponPercent / 100);
  } else if (input.qty >= 3) {
    total = total * 0.9;
  }
  return Math.max(0, total);
}

const cases = [
  { name: "ซื้อ 2 ชิ้นไม่ลด", input: { unitPrice: 100, qty: 2 } },
  { name: "ซื้อครบ 3 ชิ้นลด 10%", input: { unitPrice: 100, qty: 3 } },
  { name: "คูปองไม่ซ้อนกับส่วนลดชิ้น", input: { unitPrice: 100, qty: 4, couponPercent: 20 } },
  { name: "ราคาไม่ติดลบ", input: { unitPrice: 50, qty: 1, couponPercent: 150 } },
];

export function GET() {
  const { netPrice } = loadPrice();
  const rows = cases.map((item) => {
    const actual = netPrice(item.input);
    const want = expected(item.input);
    return { name: item.name, actual, expected: want, pass: actual === want };
  });
  return NextResponse.json({
    passing: rows.filter((row) => row.pass).length,
    total: rows.length,
    cases: rows,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    unitPrice?: number;
    qty?: number;
    couponPercent?: number;
  };
  const input = {
    unitPrice: Number(body.unitPrice) || 0,
    qty: Number(body.qty) || 0,
    couponPercent: Number(body.couponPercent) || 0,
  };
  const { netPrice } = loadPrice();
  return NextResponse.json({
    actual: netPrice(input),
    expected: expected(input),
  });
}
