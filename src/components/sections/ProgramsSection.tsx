import { useEffect, useState } from "react";
import { externalLinks } from "../../data/links";
import { Button } from "../shared/Button";
import { ProgramLink } from "../shared/ProgramLink";
import { KineticTitle } from "../shared/KineticTitle";
import "./ProgramsSection.css";

const eliteStockEndpoint = import.meta.env.VITE_ELITE_STOCK_ENDPOINT || "/api/elite-availability";
const fallbackEliteOpenings = 2;

type AvailabilityStatus = "fallback" | "live" | "unlimited";

const plans = [
  {
    key: "free" as const,
    eyebrow: "Start here",
    name: "Community",
    price: "$0",
    cadence: "forever",
    delivery: "Community access",
    description: "Learn how RL Labs thinks, join live community sessions, and train around players who take improvement seriously.",
    features: ["RL Labs Discord access", "Live weekly community classes", "Train alongside serious players"],
  },
  {
    key: "premium" as const,
    eyebrow: "Most popular",
    name: "Premium",
    price: "$19.99",
    cadence: "per month",
    delivery: "Group coaching · shared system",
    description: "The complete RL Labs system for players who can take great group coaching and put it into practice independently.",
    features: [
      "Everything in Community",
      "Weekly interactive group coaching",
      "Replay reviews + guest coaches",
      "24/7 lesson library access",
    ],
    featured: true,
  },
  {
    key: "elite" as const,
    eyebrow: "Private coaching",
    name: "Elite",
    price: "$297",
    cadence: "per month",
    delivery: "1-on-1 coaching · custom routine",
    description: "Maximum accountability for players who want a plan built around their game and a direct, ongoing feedback loop.",
    features: [
      "Everything in Premium",
      "2× weekly private coaching",
      "Personalized weekly routine",
      "Priority direct access to Kinseh",
    ],
    elite: true,
  },
];

export function ProgramsSection() {
  const [eliteOpenings, setEliteOpenings] = useState<number | null>(fallbackEliteOpenings);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>("fallback");
  const eliteAvailability = availabilityStatus === "unlimited"
      ? "Elite enrollment is currently open"
      : eliteOpenings === 0
        ? "Elite is currently at capacity"
        : eliteOpenings !== null
          ? `${eliteOpenings} ${eliteOpenings === 1 ? "opening" : "openings"} currently available`
          : "Elite enrollment is currently open";

  useEffect(() => {
    const controller = new AbortController();

    fetch(eliteStockEndpoint, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Elite stock endpoint returned an error");
        return response.json() as Promise<{ available?: unknown; unlimited?: unknown }>;
      })
      .then((payload) => {
        if (payload.unlimited === true && payload.available === null) {
          setEliteOpenings(null);
          setAvailabilityStatus("unlimited");
          return;
        }

        const nextValue = payload.available;
        if (typeof nextValue !== "number" || !Number.isInteger(nextValue) || nextValue < 0) {
          throw new Error("Elite stock endpoint returned invalid availability");
        }

        setEliteOpenings(nextValue);
        setAvailabilityStatus("live");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEliteOpenings(fallbackEliteOpenings);
        setAvailabilityStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="programs-section section-pad" id="programs">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow dark-eyebrow">Choose your level of support</p>
          <KineticTitle
            lines={[
              { text: "One system." },
              { text: "Three ways in.", accent: true },
            ]}
          />
        </div>
        <p>Premium is the best fit for most players. Choose Elite when private coaching, a personal routine, and tighter accountability are the difference-maker.</p>
      </div>

      <div className="plan-grid">
        {plans.map((plan, index) => (
          <article
            className={`plan-card plan-${plan.key} ${plan.featured ? "featured" : ""} ${plan.elite ? "elite" : ""}`}
            data-reveal
            key={plan.key}
          >
            {plan.featured && <span className="featured-flag">MOST POPULAR / BUILT FOR MOST PLAYERS</span>}
            {plan.elite && <span className="elite-flag"><i />{eliteAvailability}</span>}
            <div className="plan-head">
              <p><i />{plan.eyebrow}</p>
              <span className="plan-code">0{index + 1}</span>
            </div>
            <span className="protocol-label">TRAINING PROTOCOL / {plan.key.toUpperCase()}</span>
            <h3>{plan.name}</h3>
            <span className="plan-delivery">{plan.delivery}</span>
            {plan.elite && (
              <div className="elite-capacity" aria-label={eliteAvailability}>
                <strong className={eliteOpenings === null ? "is-pending" : undefined}>
                  {eliteOpenings ?? "∞"}
                </strong>
                <span>
                  <b>
                    {eliteOpenings !== null
                      ? eliteOpenings === 0
                        ? "New spots coming soon"
                        : "Elite spots available"
                      : availabilityStatus === "unlimited"
                          ? "Elite enrollment open"
                          : "Elite availability"}
                  </b>
                  <small>
                    {availabilityStatus === "live"
                      ? eliteOpenings === 0
                        ? "Join Discord for availability updates"
                        : "Live capacity from Whop"
                      : availabilityStatus === "unlimited"
                          ? "No finite purchase limit set"
                          : "Limited private capacity"}
                  </small>
                </span>
              </div>
            )}
            <div className="plan-price"><strong>{plan.price}</strong><span>{plan.cadence}</span></div>
            <p className="plan-description">{plan.description}</p>
            <ul>
              {plan.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
            </ul>
            {plan.key === "elite" && eliteOpenings === 0 ? (
              <Button href={externalLinks.discord} variant="outline">
                Join Discord for updates
              </Button>
            ) : plan.key === "free" ? (
              <ProgramLink plan="free" variant="inline" className="plan-free-link" />
            ) : (
              <ProgramLink plan={plan.key} variant={plan.featured ? "primary" : "outline"} />
            )}
          </article>
        ))}
      </div>

    </section>
  );
}
