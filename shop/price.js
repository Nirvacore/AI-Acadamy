/**
 * คิดราคาสุทธิของสินค้าชิ้นเดียวหลายจำนวน
 *
 * กฎที่ต้องการ (ยังทำไม่ครบในไฟล์นี้):
 * - ซื้อครบ 3 ชิ้นลด 10%
 * - คูปองไม่ซ้อนกับส่วนลดชิ้น
 * - ราคาไม่ติดลบ
 *
 * @param {object} input
 * @param {number} input.unitPrice ราคาต่อชิ้น เป็นบาท
 * @param {number} input.qty จำนวนชิ้น
 * @param {number} [input.couponPercent] ส่วนลดคูปองเป็นเปอร์เซ็นต์ 0–100
 * @returns {number} ราคาสุทธิ
 */
function netPrice(input) {
  const unitPrice = input.unitPrice;
  const qty = input.qty;
  const couponPercent = input.couponPercent || 0;

  let total = unitPrice * qty;

  // บั๊ก: ใช้ > 3 จึงซื้อ 3 ชิ้นแล้วไม่ลด
  if (qty > 3) {
    total = total * 0.9;
  }

  // บั๊ก: คูปองซ้อนกับส่วนลดชิ้น
  if (couponPercent) {
    total = total * (1 - couponPercent / 100);
  }

  // บั๊ก: ไม่กันราคาติดลบถ้าเปอร์เซ็นต์เกิน 100
  return total;
}

module.exports = { netPrice };
