type TitleLine = {
  text: string;
  accent?: boolean;
};

type KineticTitleProps = {
  as?: "h1" | "h2";
  className?: string;
  lines: readonly TitleLine[];
};

/** Primary display heading with explicit semantic line breaks. */
export function KineticTitle({
  as: Tag = "h2",
  className,
  lines,
}: KineticTitleProps) {
  const titleClassName = ["kinetic-title", className].filter(Boolean).join(" ");
  const accessibleTitle = lines.map((line) => line.text).join(" ");

  return (
    <Tag className={titleClassName} aria-label={accessibleTitle}>
      {lines.map((line) => (
        <span className="kinetic-title-line" key={line.text}>
          {line.accent ? <em>{line.text}</em> : line.text}
        </span>
      ))}
    </Tag>
  );
}
