import { hashString, initials } from "../utils/format";

const TONES = [
  "bg-vc-avatar-teal text-vc-primary-dark",
  "bg-vc-avatar-blue text-vc-navy",
  "bg-vc-avatar-purple text-vc-navy",
  "bg-vc-avatar-lavender text-vc-navy"
];

interface Props {
  name: string;
  size?: number;
  /** Overrides the initials, e.g. "8A" for a class. */
  label?: string;
  square?: boolean;
}

export function Avatar({ name, size = 40, label, square }: Props) {
  const tone = TONES[hashString(name) % TONES.length];
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 select-none place-items-center font-extrabold ${tone} ${
        square ? "rounded-xl" : "rounded-full"
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {label ?? initials(name)}
    </span>
  );
}