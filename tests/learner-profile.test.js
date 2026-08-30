const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeLearnerChoice,
  recommendProfileAdjustment,
} = require("../lib/learner-profile");

test("ตัวเลือกผู้เรียนที่ถูกต้องคงรูปแบบ จังหวะ และระดับตัวช่วย", () => {
  assert.deepEqual(
    normalizeLearnerChoice({ presentation: "story", pace: "calm", support: "guided" }),
    { presentation: "story", pace: "calm", support: "guided" },
  );
});

test("ค่าที่ไม่รู้จักกลับค่าเป็นกลางโดยไม่เดาอายุ", () => {
  const normalized = normalizeLearnerChoice({
    presentation: "เด็ก",
    pace: "เร็วที่สุด",
    support: "ตามอายุ",
    age: 8,
  });

  assert.deepEqual(normalized, {
    presentation: "balanced",
    pace: "steady",
    support: "standard",
  });
  assert.equal("age" in normalized, false);
});

test("ลองแล้วพอดีไม่เสนอเปลี่ยนตัวเลือกของผู้เรียน", () => {
  const result = recommendProfileAdjustment(
    { presentation: "direct", pace: "intensive", support: "light" },
    "right",
  );

  assert.deepEqual(result.recommended, result.selected);
  assert.equal(result.changed, false);
  assert.equal(result.reason, "จังหวะนี้พอดีกับแบบลองสั้น");
});

test("ลองแล้วยากไปเสนอเพิ่มตัวช่วยทีละระดับโดยรักษารูปแบบและจังหวะเดิม", () => {
  const result = recommendProfileAdjustment(
    { presentation: "direct", pace: "intensive", support: "light" },
    "too-hard",
  );

  assert.deepEqual(result.selected, {
    presentation: "direct",
    pace: "intensive",
    support: "light",
  });
  assert.deepEqual(result.recommended, {
    presentation: "direct",
    pace: "intensive",
    support: "standard",
  });
  assert.equal(result.changed, true);
});

test("ลองแล้วง่ายไปเสนอเบาตัวช่วยทีละระดับและไม่ต่ำกว่า light", () => {
  const first = recommendProfileAdjustment(
    { presentation: "balanced", pace: "steady", support: "guided" },
    "too-easy",
  );
  const floor = recommendProfileAdjustment(
    { presentation: "balanced", pace: "steady", support: "light" },
    "too-easy",
  );

  assert.equal(first.recommended.support, "standard");
  assert.equal(floor.recommended.support, "light");
  assert.equal(floor.changed, false);
});
