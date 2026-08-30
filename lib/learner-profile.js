const PRESENTATIONS = ["story", "balanced", "direct"];
const PACES = ["calm", "steady", "intensive"];
const SUPPORTS = ["light", "standard", "guided"];
const TRIAL_RESULTS = ["too-easy", "right", "too-hard"];

function memberOr(value, options, fallback) {
  return options.includes(value) ? value : fallback;
}

function normalizeLearnerChoice(choice = {}) {
  return {
    presentation: memberOr(choice.presentation, PRESENTATIONS, "balanced"),
    pace: memberOr(choice.pace, PACES, "steady"),
    support: memberOr(choice.support, SUPPORTS, "standard"),
  };
}

function recommendProfileAdjustment(choice, trialResult) {
  const selected = normalizeLearnerChoice(choice);
  const result = memberOr(trialResult, TRIAL_RESULTS, "right");
  const currentIndex = SUPPORTS.indexOf(selected.support);
  const nextIndex = result === "too-hard"
    ? Math.min(currentIndex + 1, SUPPORTS.length - 1)
    : result === "too-easy"
      ? Math.max(currentIndex - 1, 0)
      : currentIndex;
  const recommended = { ...selected, support: SUPPORTS[nextIndex] };
  const changed = recommended.support !== selected.support;

  const reason = result === "too-hard"
    ? changed
      ? "แบบลองสั้นยังแน่นไป เสนอเพิ่มตัวช่วยหนึ่งระดับ"
      : "เปิดตัวช่วยเต็มระดับแล้ว คงรูปแบบเดิมและแบ่งงานให้สั้นลง"
    : result === "too-easy"
      ? changed
        ? "แบบลองสั้นเบาไป เสนอลดตัวช่วยหนึ่งระดับ"
        : "ระดับนี้กระชับที่สุดแล้ว คงไว้และเพิ่มความท้าทายในโจทย์"
      : "จังหวะนี้พอดีกับแบบลองสั้น";

  return { selected, recommended, changed, reason };
}

module.exports = {
  normalizeLearnerChoice,
  recommendProfileAdjustment,
};
