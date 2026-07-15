import { useState, type KeyboardEvent } from "react";
import { Arrow } from "../shared/Arrow";
import { KineticTitle } from "../shared/KineticTitle";
import "./MethodSection.css";

const methods = [
  {
    id: "opponents",
    number: "01",
    label: "Opponents",
    navCopy: "Pressure · possession · threat",
    title: "Read the play before it happens.",
    copy: "Build a fast, repeatable read on pressure, possession, and threat—so your next touch comes from information, not panic.",
    signal: "Threat recognition",
    call: "Track the ball-car gap. Challenge the next touch, not the car.",
    readoutLabel: "Challenge window",
    readout: "0.42s",
  },
  {
    id: "boost",
    number: "02",
    label: "Boost",
    navCopy: "Pads · path · recovery",
    title: "Spend resources without leaving the play.",
    copy: "Stop confusing speed with urgency. Recover through the small-pad lane, keep goal-side position, and arrive with enough boost for the next decision.",
    signal: "Resource control",
    call: "Three small pads give you 36 boost without abandoning the rotation.",
    readoutLabel: "Rotation yield",
    readout: "+36 boost",
  },
  {
    id: "teammates",
    number: "03",
    label: "Teammates",
    navCopy: "Role · spacing · cover",
    title: "Make your position readable.",
    copy: "Adapt to the player beside you without abandoning structure. Give first man room, protect the loss, and stay ready for the next touch.",
    signal: "Team spacing",
    call: "Let first man force the play. Hold behind them until the outcome is clear.",
    readoutLabel: "Current role",
    readout: "2nd man",
  },
] as const;

type MethodId = (typeof methods)[number]["id"];
type NodeTone = "you" | "mate" | "opp";

function CarNode({ x, y, tone, label, labelX = 19, labelY = 4 }: {
  x: number;
  y: number;
  tone: NodeTone;
  label: string;
  labelX?: number;
  labelY?: number;
}) {
  return (
    <g className={`mf-car mf-car-${tone}`} transform={`translate(${x} ${y})`}>
      <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" />
      <text x={labelX} y={labelY}>{label}</text>
    </g>
  );
}

function ArenaBase() {
  return (
    <>
      <g className="mf-arena">
        <rect x="40" y="32" width="720" height="356" rx="28" />
        <line x1="400" y1="32" x2="400" y2="388" />
        <circle cx="400" cy="210" r="54" />
        <path d="M40 158 H18 V262 H40" />
        <path d="M760 158 H782 V262 H760" />
        <text x="55" y="247">OUR GOAL</text>
      </g>
      <g className="mf-full-pads" aria-hidden="true">
        <circle cx="92" cy="82" r="9" />
        <circle cx="92" cy="338" r="9" />
        <circle cx="400" cy="60" r="9" />
        <circle cx="400" cy="360" r="9" />
        <circle cx="708" cy="82" r="9" />
        <circle cx="708" cy="338" r="9" />
      </g>
    </>
  );
}

function OpponentsField() {
  return (
    <>
      <path className="mf-threat-lane" d="M500 215 C390 205 250 205 72 210" />
      <path className="mf-route mf-route-opp" d="M565 228 C548 226 530 222 511 216" markerEnd="url(#mf-arrow-grey)" />
      <path className="mf-route mf-route-you" d="M350 285 C380 270 412 245 452 216" markerEnd="url(#mf-arrow-orange)" />
      <circle className="mf-read-zone" cx="465" cy="210" r="33" />
      <g className="mf-board-callout mf-board-callout-orange" transform="translate(425 145)">
        <text>NEXT TOUCH</text>
        <text y="18">CHALLENGE WINDOW</text>
      </g>
      <circle className="mf-ball" cx="515" cy="216" r="10" />
      <CarNode x={350} y={285} tone="you" label="YOU" labelX={-17} labelY={31} />
      <CarNode x={188} y={155} tone="mate" label="MATE / COVER" />
      <CarNode x={566} y={228} tone="opp" label="BALL CARRIER" />
      <CarNode x={620} y={112} tone="opp" label="2ND OPP" />
    </>
  );
}

function BoostField() {
  const pads = [
    { x: 558, y: 306 },
    { x: 470, y: 290 },
    { x: 382, y: 274 },
  ];

  return (
    <>
      <g className="mf-context-play">
        <path className="mf-route mf-route-mate" d="M438 155 C462 151 485 149 507 149" markerEnd="url(#mf-arrow-blue)" />
        <circle className="mf-ball" cx="520" cy="148" r="10" />
        <CarNode x={430} y={158} tone="mate" label="MATE / PRESSURE" labelX={-35} labelY={32} />
        <CarNode x={562} y={144} tone="opp" label="OPP" />
      </g>

      <path className="mf-boost-detour" d="M635 316 C665 323 690 332 706 338" />
      <text className="mf-detour-label" x="620" y="374">100 BOOST / LEAVES THE PLAY</text>
      <circle className="mf-full-pad-active" cx="708" cy="338" r="18" />

      <path className="mf-route mf-route-boost" d="M624 314 C555 307 475 289 385 274 C340 266 300 252 260 238" markerEnd="url(#mf-arrow-lime)" />
      <g className="mf-small-pads">
        {pads.map((pad) => (
          <g transform={`translate(${pad.x} ${pad.y})`} key={`${pad.x}-${pad.y}`}>
            <circle r="12" />
            <text x="-8" y="-18">+12</text>
          </g>
        ))}
      </g>
      <g className="mf-board-callout mf-board-callout-lime" transform="translate(326 225)">
        <text>SMALL-PAD LINE</text>
        <text y="18">LANE KEPT · +36</text>
      </g>
      <CarNode x={636} y={316} tone="you" label="YOU / ROTATING" labelX={-46} labelY={33} />
    </>
  );
}

function TeammatesField() {
  return (
    <>
      <path className="mf-cover-lane" d="M286 282 C230 260 170 234 72 212" />
      <path className="mf-route mf-route-mate" d="M465 210 C480 207 496 205 510 205" markerEnd="url(#mf-arrow-blue)" />
      <path className="mf-route mf-route-option" d="M305 274 C334 246 373 220 419 205" markerEnd="url(#mf-arrow-orange)" />
      <path className="mf-route mf-route-option" d="M311 293 C345 305 380 312 420 310" markerEnd="url(#mf-arrow-orange)" />
      <ellipse className="mf-support-zone" cx="300" cy="286" rx="55" ry="38" />
      <path className="mf-spacing-line" d="M323 272 L442 219" />
      <text className="mf-spacing-label" x="342" y="262">READABLE GAP</text>
      <g className="mf-board-callout mf-board-callout-orange" transform="translate(235 342)">
        <text>HOLD SECOND MAN</text>
        <text y="18">COVER THE WIN + THE LOSS</text>
      </g>
      <circle className="mf-ball" cx="523" cy="204" r="10" />
      <CarNode x={300} y={286} tone="you" label="YOU / 2ND" labelX={-27} labelY={34} />
      <CarNode x={458} y={211} tone="mate" label="MATE / 1ST" labelX={-30} labelY={34} />
      <CarNode x={565} y={208} tone="opp" label="BALL CARRIER" />
      <CarNode x={620} y={110} tone="opp" label="2ND OPP" />
    </>
  );
}

function MethodField({ method }: { method: MethodId }) {
  const descriptions: Record<MethodId, string> = {
    opponents: "The opponent attacks the left goal. You hold the approach and challenge the opponent's next touch while your teammate covers the goal.",
    boost: "You rotate toward the left goal through three small boost pads while your teammate pressures the ball, avoiding a detour to the corner boost.",
    teammates: "Your teammate challenges as first man while you hold a central second-man position that covers both a won and a lost challenge.",
  };

  return (
    <svg className="method-field" viewBox="0 20 800 380" role="img" aria-label={descriptions[method]}>
      <defs>
        <marker id="mf-arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" />
        </marker>
        <marker id="mf-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" />
        </marker>
        <marker id="mf-arrow-grey" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" />
        </marker>
        <marker id="mf-arrow-lime" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" />
        </marker>
      </defs>

      <ArenaBase />
      {method === "opponents" && <OpponentsField />}
      {method === "boost" && <BoostField />}
      {method === "teammates" && <TeammatesField />}
    </svg>
  );
}

export function MethodSection() {
  const [activeMethod, setActiveMethod] = useState(0);
  const selectedMethod = methods[activeMethod];

  const selectMethod = (index: number) => {
    setActiveMethod(index);
    document.getElementById(`method-tab-${methods[index].id}`)?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectMethod((index + 1) % methods.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectMethod((index - 1 + methods.length) % methods.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectMethod(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectMethod(methods.length - 1);
    }
  };

  return (
    <section className="method-section section-pad" id="method">
      <div className="section-heading light-heading" data-reveal>
        <div>
          <p className="eyebrow">The RL Labs method</p>
          <KineticTitle
            lines={[
              { text: "Playstyle" },
              { text: "Engineering.", accent: true },
            ]}
          />
        </div>
        <p>
          We rebuild how you process the field around three universal indicators. One framework. Every rank. Every queue.
        </p>
      </div>

      <div className="method-console" data-reveal>
        <div className="method-workspace">
          <aside className="method-rail">
            <div className="method-rail-heading">
              <span>Field indicators</span>
              <strong>Choose the signal</strong>
            </div>
            <div className="method-nav" role="tablist" aria-label="Coaching system indicators" aria-orientation="vertical">
              {methods.map((method, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`method-tab-${method.id}`}
                  aria-controls="method-panel"
                  aria-selected={activeMethod === index}
                  tabIndex={activeMethod === index ? 0 : -1}
                  className={activeMethod === index ? "active" : ""}
                  onClick={() => setActiveMethod(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  key={method.id}
                >
                  <span className="method-nav-number">{method.number}</span>
                  <span className="method-nav-copy">
                    <strong>{method.label}</strong>
                    <small>{method.navCopy}</small>
                  </span>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          </aside>

          <div className="method-stage" id="method-panel" role="tabpanel" aria-labelledby={`method-tab-${selectedMethod.id}`}>
            <div className="method-stage-intro" key={`copy-${selectedMethod.id}`}>
              <div className="method-copy">
                <span className="system-label">System signal / {selectedMethod.signal}</span>
                <h3>{selectedMethod.title}</h3>
                <p>{selectedMethod.copy}</p>
                <a href="#programs" className="inline-link">Put it into practice <Arrow /></a>
              </div>
              <div className="method-principle">
                <span>Coach cue</span>
                <strong>{selectedMethod.call}</strong>
              </div>
            </div>

            <div className={`tactics-board board-${selectedMethod.id}`} key={`board-${selectedMethod.id}`}>
              <div className="replay-stamp">
                <span>FRAME / 02:43.18</span>
                <strong>{selectedMethod.signal}</strong>
              </div>
              <div className="board-hud">
                <span>{selectedMethod.readoutLabel}</span>
                <strong>{selectedMethod.readout}</strong>
              </div>
              <MethodField method={selectedMethod.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
