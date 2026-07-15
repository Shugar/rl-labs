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
        <p>The blueprint is already built. Choose the level of support that matches your goal.</p>
        <div className="cta-actions">
          <ProgramLink plan="premium" variant="primary" />
          <ProgramLink plan="free" variant="ghost" />
        </div>
      </div>
      <div className="cta-rank-stage" data-reveal>
        <div className="cta-rank">
          <span className="cta-rank-head">
            <span>PLAYER PROGRESSION / COACH-ASSISTED</span>
            <span className="cta-rank-tier">TIER 05 // 08</span>
          </span>
          <div className="promotion-panel">
            <div><RankIcon rank={ranks[4]} /><span>NOW / DIAMOND</span></div>
            <div className="promotion-track" aria-hidden="true">
              <span className="promotion-line"><b /><b /><i /></span>
              <span className="promotion-waypoints">
                <span>{ranks[5].short}</span>
                <span>{ranks[6].short}</span>
              </span>
            </div>
            <div className="promotion-next">
              <i className="promotion-reticle" aria-hidden="true" />
              <RankIcon rank={ranks[7]} />
              <span>NEXT / SSL</span>
            </div>
          </div>
          <div className="promotion-meta">
            <div><span>TIERS UP</span><strong>+03</strong></div>
            <div><span>FIELD ROUTE</span><strong>{ranks[5].short} // {ranks[6].short}</strong></div>
            <div><span>STATUS</span><strong className="promotion-live"><i />ROTATION</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}
