const test = require("node:test");
const assert = require("node:assert/strict");
const { netPrice } = require("./price");

test("ซื้อ 2 ชิ้นไม่ลด", () => {
  assert.equal(netPrice({ unitPrice: 100, qty: 2 }), 200);
});

test("ซื้อครบ 3 ชิ้นลด 10%", () => {
  assert.equal(netPrice({ unitPrice: 100, qty: 3 }), 270);
});

test("คูปองไม่ซ้อนกับส่วนลดชิ้น", () => {
  // ซื้อ 4 ชิ้นมีทั้งส่วนลดชิ้นและคูปอง 20% ต้องใช้คูปองอย่างเดียว = 320
  assert.equal(
    netPrice({ unitPrice: 100, qty: 4, couponPercent: 20 }),
    320,
  );
});

test("ราคาไม่ติดลบ", () => {
  assert.equal(
    netPrice({ unitPrice: 50, qty: 1, couponPercent: 150 }),
    0,
  );
});
