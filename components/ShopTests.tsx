"use client";

import { useEffect, useState } from "react";
import { expectedPrice, shopCases, type PriceInput } from "@/lib/shop-cases";
import { netPrice } from "@/shop/price.js";

type CaseResult = {
  name: string;
  expected: number;
  actual: number;
  pass: boolean;
};

type Report = {
  passing: number;
  total: number;
  cases: CaseResult[];
};

function runCases(): Report {
  const cases = shopCases.map((item) => {
    const actual = netPrice(item.input);
    const want = expectedPrice(item.input);
    return { name: item.name, actual, expected: want, pass: actual === want };
  });
  return {
    passing: cases.filter((item) => item.pass).length,
    total: cases.length,
    cases,
  };
}

export function ShopTests() {
  const [report, setReport] = useState<Report | null>(null);
  const [unitPrice, setUnitPrice] = useState(100);
  const [qty, setQty] = useState(3);
  const [couponPercent, setCouponPercent] = useState(0);
  const [trial, setTrial] = useState<{ actual: number; expected: number } | null>(null);

  function load() {
    setReport(runCases());
  }

  useEffect(() => {
    load();
  }, []);

  function tryOne(event: React.FormEvent) {
    event.preventDefault();
    const input: PriceInput = { unitPrice, qty, couponPercent };
    setTrial({ actual: netPrice(input), expected: expectedPrice(input) });
  }

  return (
    <section className="shop-tests">
      <p className="eyebrow">เทสในเบราว์เซอร์</p>
      <h2>สถานะ shop/price.js ตอนนี้</h2>
      <p className="lede">
        แดงตั้งใจจนกว่าจะแก้ไฟล์ในเครื่อง รัน <code>npm run dev</code> แล้วรีเฟรช
        หน้านี้ใช้ฟังก์ชันเดียวกับไฟล์แล็บ ไม่ต้องมีเซิร์ฟเวอร์ API
      </p>
      {report ? (
        <>
          <p>
            ผ่าน {report.passing} จาก {report.total}
          </p>
          <table>
            <thead>
              <tr>
                <th>เคส</th>
                <th>ได้</th>
                <th>ควรได้</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {report.cases.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.actual}</td>
                  <td>{item.expected}</td>
                  <td>{item.pass ? "ผ่าน" : "ยัง"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="progress-mark" onClick={load}>
            รันเทสอีกครั้ง
          </button>
        </>
      ) : null}

      <form className="trial" onSubmit={tryOne}>
        <h3>ลองตัวเลข</h3>
        <label>
          ราคาต่อชิ้น
          <input
            type="number"
            value={unitPrice}
            onChange={(event) => setUnitPrice(Number(event.target.value))}
          />
        </label>
        <label>
          จำนวน
          <input type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))} />
        </label>
        <label>
          คูปอง %
          <input
            type="number"
            value={couponPercent}
            onChange={(event) => setCouponPercent(Number(event.target.value))}
          />
        </label>
        <button type="submit" className="btn primary">
          คิดราคา
        </button>
      </form>
      {trial ? (
        <p>
          ไฟล์ตอนนี้ให้ {trial.actual} · ตามกฎควรได้ {trial.expected}
        </p>
      ) : null}
    </section>
  );
}
