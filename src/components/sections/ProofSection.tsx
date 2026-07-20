import { useState } from "react";
import { externalLinks } from "../../data/links";
import { memberReviews } from "../../data/proof";
import { Arrow } from "../shared/Arrow";
import { KineticTitle } from "../shared/KineticTitle";
import "./ProofSection.css";

const replayPhases = [
  {
    id: "leak",
    tab: "Week 01 · Leak",
    stamp: "RPL-0043 / Own half",
    title: "Both players chase the ball.",
    summary: "The first defender challenges, but the second defender follows. The goal is left without a covering player.",
  },
  {
    id: "fix",
    tab: "Week 05 · Fix",
    stamp: "RPL-0121 / Same situation",
    title: "One challenges. One covers.",
    summary: "The first defender forces the touch while the second defender rotates to the back post and protects the goal.",
  },
] as const;

type ReplayPhase = (typeof replayPhases)[number]["id"];

/* A top-down 2v2 defensive replay. The orange and blue players defend the
   left goal; the grey team attacks from right to left. */
function ReplayField({ phase }: { phase: ReplayPhase }) {
  const isFix = phase === "fix";

  return (
    <svg viewBox="0 0 620 360" role="img" aria-labelledby={`replay-${phase}-title replay-${phase}-desc`}>
      <title id={`replay-${phase}-title`}>
        {isFix ? "Corrected challenge and cover rotation" : "Double commit leaving the goal uncovered"}
      </title>
      <desc id={`replay-${phase}-desc`}>
        {isFix
          ? "The orange first defender challenges the ball carrier while the blue second defender rotates to the back post of the left goal."
          : "The orange and blue defenders both move toward the ball carrier, leaving the left goal without cover."}
      </desc>

      <defs>
        <marker id="arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>

      <g className="rf-pitch">
        <rect x="30" y="28" width="560" height="304" rx="24" />
        <line x1="310" y1="28" x2="310" y2="332" />
        <circle cx="310" cy="180" r="49" />
      </g>

      <g className="rf-goals">
        <path d="M30 132 H13 V228 H30" />
        <path d="M590 132 H607 V228 H590" />
        <text x="42" y="218">OUR GOAL</text>
      </g>

      <g className="rf-boost-pads" aria-hidden="true">
        <circle cx="82" cy="76" r="8" />
        <circle cx="82" cy="284" r="8" />
        <circle cx="310" cy="54" r="8" />
        <circle cx="310" cy="306" r="8" />
        <circle cx="538" cy="76" r="8" />
        <circle cx="538" cy="284" r="8" />
      </g>

      <g className="rf-opponents">
        <circle className="rf-ball" cx="432" cy="185" r="10" />
        <g transform="translate(472 186)">
          <rect className="rf-node rf-opp" x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
          <text x="20" y="4">BALL CARRIER</text>
        </g>
        <g transform="translate(370 94)">
          <rect className="rf-node rf-opp" x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
          <text x="20" y="4">2ND OPP</text>
        </g>
      </g>

      <g className="rf-defenders">
        <g transform="translate(235 245)">
          <rect className="rf-node rf-you" x="-10" y="-10" width="20" height="20" transform="rotate(45)" />
          <text x="-25" y="34">YOU · 1ST</text>
        </g>
        <g transform={isFix ? "translate(115 128)" : "translate(220 105)"}>
          <rect className="rf-node rf-mate" x="-10" y="-10" width="20" height="20" transform="rotate(45)" />
          <text x="18" y="4">MATE · 2ND</text>
        </g>
      </g>

      <path
        className={`rf-route rf-route-you ${isFix ? "is-solid" : "is-danger"}`}
        d="M250 232 C300 210 352 196 414 187"
        markerEnd="url(#arrow-orange)"
      />

      {isFix ? (
        <g className="rf-fix-layer">
          <path className="rf-route rf-route-mate is-solid" d="M210 108 C172 102 135 108 118 120" markerEnd="url(#arrow-blue)" />
          <path className="rf-cover-arc" d="M71 180 C83 151 95 137 112 128" />
          <circle className="rf-cover-zone" cx="108" cy="132" r="34" />
          <g className="rf-callout rf-callout-fix" transform="translate(105 67)">
            <text>BACK-POST COVER</text>
            <text y="18">GOAL STAYS PROTECTED</text>
          </g>
          <text className="rf-action-label" x="326" y="221">CHALLENGE</text>
        </g>
      ) : (
        <g className="rf-leak-layer">
          <path className="rf-route rf-route-mate is-danger" d="M236 112 C300 124 353 151 415 180" markerEnd="url(#arrow-blue)" />
          <path className="rf-open-lane" d="M420 185 C310 181 187 180 45 180" />
          <g className="rf-callout rf-callout-leak" transform="translate(105 67)">
            <text>NO 2ND-MAN COVER</text>
            <text y="18">GOAL LEFT OPEN</text>
          </g>
        </g>
      )}
    </svg>
  );
}

export function ProofSection() {
  const [activePhase, setActivePhase] = useState<ReplayPhase>("fix");
  const selectedPhase = replayPhases.find((phase) => phase.id === activePhase) ?? replayPhases[1];
  return (
    <section className="proof-section section-pad" id="proof">
      <div className="proof-heading" data-reveal>
        <div>
          <p className="eyebrow dark-eyebrow">Results before pricing</p>
          <KineticTitle
            lines={[
              { text: "The RL Labs" },
              { text: "Development Framework.", accent: true },
            ]}
          />
        </div>
        <p>Diagnose the repeated mistake, rebuild the decision, then verify the change in replay and rank. The framework is the method; these are the member results behind it.</p>
      </div>

      <div className="proof-panel" data-reveal>
        <div className="proof-story">
          <div className="proof-narrative">
            <span className="proof-kicker">Framework demo / 2v2 defense</span>
            <h3>The same play.<br />A better decision.</h3>
            <p>This illustrative replay shows how the RL Labs Development Framework turns a recurring mistake into one trainable cue.</p>

            <ol className="proof-steps">
              <li>
                <span>01</span>
                <div><strong>Diagnose</strong><p>Both defenders commit to the same ball.</p></div>
              </li>
              <li>
                <span>02</span>
                <div><strong>Rebuild</strong><p>Give second man one cue: rotate behind.</p></div>
              </li>
              <li>
                <span>03</span>
                <div><strong>Verify</strong><p>The back-post cover appears under pressure.</p></div>
              </li>
            </ol>
          </div>

          <div className="proof-replay">
            <div className="replay-header">
              <div className="replay-title" aria-live="polite">
                <span>{selectedPhase.stamp}</span>
                <strong>{selectedPhase.title}</strong>
              </div>
              <div className="replay-tabs" role="tablist" aria-label="Compare the replay before and after coaching">
                {replayPhases.map((phase) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePhase === phase.id}
                    className={activePhase === phase.id ? "active" : ""}
                    onClick={() => setActivePhase(phase.id)}
                    key={phase.id}
                  >
                    {phase.tab}
                  </button>
                ))}
              </div>
            </div>

            <div className={`replay-field replay-field-${activePhase}`} key={activePhase}>
              <ReplayField phase={activePhase} />
            </div>
            <p className="replay-summary" aria-live="polite">{selectedPhase.summary}</p>
          </div>
        </div>

      </div>

      <div className="review-section-head" id="testimonials" data-reveal>
        <div>
          <span>MEMBER REVIEWS / WHOP + DISCORD</span>
          <h3>What members are saying.</h3>
        </div>
        <a href={externalLinks.reviews} target="_blank" rel="noreferrer">See verified Whop reviews <Arrow /></a>
      </div>

      <div className="review-grid">
        {memberReviews.map((review) => (
          <article className="review-card" data-reveal key={review.id}>
            <div className="review-meta">
              <span className="review-avatar">
                {review.avatar ? <img src={review.avatar} alt="" loading="lazy" /> : review.initials}
              </span>
              <div>
                <strong>{review.name}</strong>
                <span className={review.source === "Whop" ? "is-whop" : ""}>
                  {review.source === "Whop" ? "★★★★★ · Verified on Whop" : "Discord member post"}
                </span>
              </div>
            </div>
            <blockquote>“{review.quote}”</blockquote>
            <div className="review-result"><span>Reported result</span><strong>{review.result}</strong></div>
          </article>
        ))}
      </div>
    </section>
  );
}
