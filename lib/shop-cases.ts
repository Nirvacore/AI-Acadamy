export type PriceInput = {
  unitPrice: number;
  qty: number;
  couponPercent?: number;
};

export function expectedPrice(input: PriceInput) {
  const couponPercent = input.couponPercent || 0;
  let total = input.unitPrice * input.qty;
  if (couponPercent) {
    total = total * (1 - couponPercent / 100);
  } else if (input.qty >= 3) {
    total = total * 0.9;
  }
  return Math.max(0, total);
}

export const shopCases: { name: string; input: PriceInput }[] = [
  { name: "ซื้อ 2 ชิ้นไม่ลด", input: { unitPrice: 100, qty: 2 } },
  { name: "ซื้อครบ 3 ชิ้นลด 10%", input: { unitPrice: 100, qty: 3 } },
  { name: "คูปองไม่ซ้อนกับส่วนลดชิ้น", input: { unitPrice: 100, qty: 4, couponPercent: 20 } },
  { name: "ราคาไม่ติดลบ", input: { unitPrice: 50, qty: 1, couponPercent: 150 } },
];
