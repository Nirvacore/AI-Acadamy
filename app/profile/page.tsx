import type { Metadata } from "next";
import { LearnerProfileSetup } from "@/components/LearnerProfileSetup";

export const metadata: Metadata = {
  title: "ปรับวิธีเรียน",
  description: "เลือกจังหวะและระดับตัวช่วยของ Nirva Academy โดยเก็บข้อมูลในเบราว์เซอร์",
};

export default function LearnerProfilePage() {
  return <LearnerProfileSetup />;
}
