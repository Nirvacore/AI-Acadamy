import { Suspense } from "react";
import { StartClass } from "@/components/StartClass";
import { portalLessons } from "@/lib/catalog";

export const metadata = {
  title: "ชั่วโมงแรก",
  description: "นั่งลงสิบห้านาที ล็อกว่าเธอคือเอเจนต์ แล้วเริ่มบทกระจก",
};

export default function StartPage() {
  const lessons = portalLessons();

  return (
    <Suspense fallback={null}>
      <StartClass lessons={lessons} />
    </Suspense>
  );
}
