import { links, type PlanKey } from "../../data/links";
import { Button } from "../shared/Button";
import { KineticTitle } from "../shared/KineticTitle";
import "./ProgramsSection.css";

const plans: {
  key: PlanKey;
  eyebrow: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}[] = [
  {
    key: "free",
    eyebrow: "Start here",
    name: "Community",
    price: "$0",
    cadence: "forever",
    description: "For players who want a smarter way to train before committing to a full program.",
    features: [
      "Access to the RL Labs Discord",
      "Live weekly group classes",
      "Train alongside serious players",
    ],
    cta: "Join the community",
  },
  {
    key: "premium",
    eyebrow: "Most popular",
    name: "Premium",
    price: "$19.99",
    cadence: "per month",
    description: "A structured, self-paced system with live feedback and a focused community.",
    features: [
      "Everything in Community",
      "Weekly interactive group sessions",
      "Replay review weeks + guest coaches",
      "24/7 lesson library access",
    ],
    cta: "Start Premium",
    featured: true,
  },
  {
    key: "elite",
    eyebrow: "10 spots only",
    name: "Elite",
    price: "$297",
    cadence: "per month",
    description: "Private, high-accountability coaching for a rank-specific development plan.",
    features: [
      "Everything in Premium",
      "2× weekly private coaching",
      "Custom weekly training routines",
      "Priority private access to Kinseh",
    ],
    cta: "Apply for Elite",
  },
];

export function ProgramsSection() {
  return (
    <section className="programs-section section-pad" id="programs">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow dark-eyebrow">Choose your path</p>
          <KineticTitle
            lines={[
              { text: "One system." },
              { text: "Three intensities.", accent: true },
            ]}
          />
        </div>
        <p>Start where you are. Add structure, feedback, and accountability as your goals get more serious.</p>
      </div>
      <div className="plan-grid">
        {plans.map((plan) => (
          <article className={`plan-card ${plan.featured ? "featured" : ""}`} data-reveal key={plan.key}>
            {plan.featured && <span className="featured-flag">RECOMMENDED / 02</span>}
            <div className="plan-head">
              <p><i />{plan.eyebrow}</p>
              <span className="plan-code">0{plans.indexOf(plan) + 1}</span>
            </div>
            <span className="protocol-label">TRAINING PROTOCOL / {plan.key.toUpperCase()}</span>
            <h3>{plan.name}</h3>
            <div className="plan-price"><strong>{plan.price}</strong><span>{plan.cadence}</span></div>
            <p className="plan-description">{plan.description}</p>
            <ul>
              {plan.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
            </ul>
            <Button href={links[plan.key]} variant={plan.featured ? "primary" : "outline"}>
              {plan.cta}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
