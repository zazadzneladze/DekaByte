import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Quiet studio label above section titles */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-electric uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
