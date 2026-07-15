import { useState } from "react";
import { ProgramLink } from "../shared/ProgramLink";
import { KineticTitle } from "../shared/KineticTitle";
import "./FitSection.css";

const fitContent = {
  premium: {
    label: "Premium",
    title: "You want the blueprint—then you want room to execute.",
    copy: "Learn the high-level concepts, review how they show up in real games, and improve inside a group that takes the climb seriously.",
    bestFor: ["Self-directed players", "Group learning", "Flexible weekly rhythm"],
    stat: "24/7",
    statLabel: "lesson access",
  },
  elite: {
    label: "Elite",
    title: "You want the diagnosis, the routine, and the accountability.",
    copy: "Kinseh identifies the highest-leverage changes in your game and turns them into a plan built around your rank, mode, and playstyle.",
    bestFor: ["Fastest feedback loop", "1-on-1 accountability", "Rank-specific planning"],
    stat: "2×",
    statLabel: "private sessions weekly",
  },
} as const;

export function FitSection() {
  const [activeFit, setActiveFit] = useState<"premium" | "elite">("premium");
  const fit = fitContent[activeFit];

  return (
    <section className="fit-section section-pad">
      <div className="fit-heading" data-reveal>
        <p className="eyebrow">Not sure where you fit?</p>
        <KineticTitle
          lines={[{ text: "Pick your coaching rhythm." }]}
        />
      </div>
      <div className="fit-switcher" data-reveal>
        <div className="fit-tabs" role="tablist" aria-label="Compare Premium and Elite">
          {(["premium", "elite"] as const).map((key) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeFit === key}
              className={activeFit === key ? "active" : ""}
              onClick={() => setActiveFit(key)}
              key={key}
            >
              <span>{key === "premium" ? "01" : "02"}</span>
              {fitContent[key].label}
            </button>
          ))}
        </div>
        <div className="fit-panel" key={activeFit}>
          <div className="fit-copy">
            <span className="micro-label">BEST MATCH / {fit.label.toUpperCase()}</span>
            <h3>{fit.title}</h3>
            <p>{fit.copy}</p>
            <ProgramLink plan={activeFit} variant="primary" />
          </div>
          <div className="fit-spec">
            <div className="fit-stat"><strong>{fit.stat}</strong><span>{fit.statLabel}</span></div>
            <p>Ideal for</p>
            <ul>{fit.bestFor.map((item) => <li key={item}><span>↗</span>{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
