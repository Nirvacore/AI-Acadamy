"use client";

import { useEffect, useState } from "react";

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

export function ShopTests() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [unitPrice, setUnitPrice] = useState(100);
  const [qty, setQty] = useState(3);
  const [couponPercent, setCouponPercent] = useState(0);
  const [trial, setTrial] = useState<{ actual: number; expected: number } | null>(null);

  async function load() {
    setError("");
    const response = await fetch("/api/shop-test");
    if (!response.ok) {
      setError("เรียกเทสไม่สำเร็จ");
      return;
    }
    setReport(await response.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function tryOne(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/shop-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitPrice, qty, couponPercent }),
    });
    if (!response.ok) {
      setError("ทดลองคิดราคาไม่สำเร็จ");
      return;
    }
    setTrial(await response.json());
  }

  return (
    <section className="shop-tests">
      <p className="eyebrow">เทสในเบราว์เซอร์</p>
      <h2>สถานะ shop/price.js ตอนนี้</h2>
      <p className="lede">
        แดงตั้งใจจนกว่าจะแก้ไฟล์ในเครื่อง แล้วรีเฟรชหน้านี้ กฎที่ถูกคิดฝั่งเซิร์ฟเวอร์จากไฟล์จริง
      </p>
      {error ? <p className="lede">{error}</p> : null}
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
          <button type="button" className="progress-mark" onClick={() => void load()}>
            รันเทสอีกครั้ง
          </button>
        </>
      ) : null}

      <form className="trial" onSubmit={(event) => void tryOne(event)}>
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
