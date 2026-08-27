"use client";

export function LessonOutline({
  items,
}: {
  items: { id: string; title: string }[];
}) {
  if (items.length < 2) return null;
  return (
    <nav className="outline" aria-label="โครงบท">
      <p className="eyebrow">โครงบท</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
