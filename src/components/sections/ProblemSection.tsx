import { KineticTitle } from "../shared/KineticTitle";
import "./ProblemSection.css";

export function ProblemSection() {
  return (
    <section className="problem-section section-pad">
      <div className="problem-intro" data-reveal>
        <p className="eyebrow dark-eyebrow">The real bottleneck</p>
        <KineticTitle
          lines={[
            { text: "You are not hardstuck." },
            { text: "Your system is.", accent: true },
          ]}
        />
      </div>
      <div className="problem-layout">
        <p className="problem-lede" data-reveal>
          Most players add more hours when the answer is better information. They chase mechanics, blame the queue, and repeat the same decisions faster.
        </p>
        <div className="bad-loop" data-reveal aria-label="The common hardstuck loop">
          <div className="postmatch-head">
            <span>Post-match review // Loss 2—3</span>
            <span className="rec-signal"><i /> VOD_0472</span>
          </div>
          <div className="loop-node"><span>01 / NO PRE-READ</span>Queue blind<small>Same habits loaded</small></div>
          <div className="loop-arrow">→</div>
          <div className="loop-node"><span>02 / PANIC TOUCH</span>React late<small>Pressure compounds</small></div>
          <div className="loop-arrow">→</div>
          <div className="loop-node loop-alert"><span>03 / NO REVIEW</span>Repeat<small>MMR unchanged</small></div>
          <svg className="loop-return" viewBox="0 0 1000 50" preserveAspectRatio="none" aria-hidden="true">
            {/* Starts at the arrowhead so the dash pattern begins with a dash at the tip */}
            <path d="M0 6 L0 26 C0 48 1000 48 1000 4" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="loop-return-head" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
