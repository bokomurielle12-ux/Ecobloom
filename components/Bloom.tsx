"use client";

/**
 * Signature element: a five-petal bloom built from arcs.
 * `openness` (0 → 1) controls how far the petals are unfurled —
 * used across the page as a literal visual of "progress toward the trip".
 */
export function Bloom({
  openness = 1,
  size = 64,
  color = "var(--bloom-bougainvillier)",
  center = "var(--bloom-or)",
  className = "",
}: {
  openness?: number;
  size?: number;
  color?: string;
  center?: string;
  className?: string;
}) {
  const petals = 5;
  const clamped = Math.max(0, Math.min(1, openness));
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(50 50)">
        {Array.from({ length: petals }).map((_, i) => {
          const angle = (360 / petals) * i;
          const spread = 8 + clamped * 22; // petals drift outward as they open
          const scale = 0.35 + clamped * 0.65;
          return (
            <ellipse
              key={i}
              cx={0}
              cy={-(18 + spread)}
              rx={10}
              ry={20}
              fill={color}
              opacity={0.55 + clamped * 0.45}
              transform={`rotate(${angle}) scale(${scale})`}
              style={{ transition: "all 0.6s cubic-bezier(.2,.8,.2,1)" }}
            />
          );
        })}
        <circle r={7 + clamped * 3} fill={center} />
      </g>
    </svg>
  );
}
