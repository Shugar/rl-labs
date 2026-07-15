import type { ReactNode } from "react";
import { Arrow } from "./Arrow";
import "./Button.css";

type ButtonProps = {
  href: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "sm";
  /** Small trailing note next to the arrow, e.g. a price ("$19.99/mo") */
  meta?: string;
  className?: string;
  children: ReactNode;
};

export function Button({ href, variant = "primary", size = "md", meta, className, children }: ButtonProps) {
  const external = href.startsWith("http");
  const classes = ["button", `button-${variant}`, size === "sm" ? "button-sm" : "", className || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      className={classes}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="button-face">
        <span className="button-label">{children}</span>
        <span className="button-meta">
          {meta && <small>{meta}</small>}
          <Arrow />
        </span>
      </span>
    </a>
  );
}
