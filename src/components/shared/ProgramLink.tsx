import { links, planPricing, type PlanKey } from "../../data/links";
import { Arrow } from "./Arrow";
import { Button } from "./Button";

const labels: Record<PlanKey, string> = {
  free: "Join free",
  premium: "Start Premium",
  elite: "Apply for Elite",
};

type ProgramLinkProps = {
  plan: PlanKey;
  /** "inline" renders a text link; the rest render a Button */
  variant?: "inline" | "primary" | "outline" | "ghost";
  className?: string;
};

export function ProgramLink({ plan, variant = "inline", className }: ProgramLinkProps) {
  const href = links[plan];
  const price = plan === "free" ? undefined : planPricing[plan];

  if (variant !== "inline") {
    return (
      <Button href={href} variant={variant} meta={price} className={className}>
        {labels[plan]}
      </Button>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      className={className || "inline-link"}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {labels[plan]}
      {price && <small className="price-tag">{price}</small>}
      <Arrow />
    </a>
  );
}
