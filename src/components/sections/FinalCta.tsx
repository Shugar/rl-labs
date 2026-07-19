import { ProgramLink } from "../shared/ProgramLink";
import { KineticTitle } from "../shared/KineticTitle";
import { RankIcon } from "../shared/RankIcon";
import { ranks } from "../../data/ranks";
import { FinalCtaWebGL } from "./FinalCtaWebGL";
import "./FinalCta.css";

export function FinalCta() {
  return (
    <section className="final-cta" id="final-cta">
      <div className="cta-backdrop" aria-hidden="true">
        <FinalCtaWebGL />
      </div>
      <div className="cta-content" data-reveal>
        <p className="eyebrow">Your next queue can be different</p>
        <KineticTitle
          lines={[
            { text: "Stop grinding" },
            { text: "In circles.", accent: true },
          ]}
        />
        <p>Start with the full group system, or apply for a private coaching routine built around your game.</p>
        <div className="cta-actions">
          <ProgramLink plan="premium" variant="primary" />
          <ProgramLink plan="elite" variant="ghost" />
          <span className="cta-free-option">Not ready? <ProgramLink plan="free" variant="inline" /></span>
        </div>
      </div>
      <div className="cta-rank-stage" data-reveal>
        <div className="cta-rank">
          <span className="cta-rank-head">
            <span>MEMBER RESULT / DISCORD</span>
            <span className="cta-rank-tier">1 SEASON</span>
          </span>
          <div className="promotion-panel">
            <div><RankIcon rank={ranks[6]} /><span>START / 1630 GC2</span></div>
            <div className="promotion-track" aria-hidden="true">
              <span className="promotion-line"><b /><b /><i /></span>
              <span className="promotion-waypoints">
                <span>GC2</span>
                <span>GC3</span>
              </span>
            </div>
            <div className="promotion-next">
              <i className="promotion-reticle" aria-hidden="true" />
              <RankIcon rank={ranks[7]} />
              <span>FINISH / SSL</span>
            </div>
          </div>
          <div className="promotion-meta">
            <div><span>MEMBER</span><strong>NATH FAN</strong></div>
            <div><span>ROUTE</span><strong>GC2 // GC3 // SSL</strong></div>
            <div><span>STATUS</span><strong className="promotion-live"><i />DOCUMENTED</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}
