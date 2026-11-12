import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <span className="text-xs font-semibold tracking-[0.18em] text-emerald-600 uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-[2.1rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-500">{description}</p>
      )}
    </div>
  );
}
