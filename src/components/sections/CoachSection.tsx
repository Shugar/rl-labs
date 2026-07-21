import { KineticTitle } from "../shared/KineticTitle";
import "./CoachSection.css";

export function CoachSection() {
  return (
    <section className="coach-section section-pad" id="coach">
      <div className="coach-grid">
        <div className="coach-card" data-reveal>
          <div className="coach-card-top">
            <span>PLAYER / COACH ID</span>
            <span>VERIFIED_25</span>
          </div>
          <div className="coach-monogram">
            <span>KINSEH</span>
            <div className="coach-rings" aria-hidden="true"><i /><i /><i /></div>
          </div>
          <div className="coach-card-bottom">
            <div><span>Handle</span><strong>KINSEH</strong></div>
            <div><span>Peak</span><strong>SSL</strong></div>
            <div><span>Role</span><strong>COACH</strong></div>
          </div>
        </div>
        <div className="coach-copy" data-reveal>
          <p className="eyebrow dark-eyebrow">Meet your coach</p>
          <KineticTitle
            lines={[
              { text: "Former Pro." },
              { text: "25+ Times SSL.", accent: true },
            ]}
          />
          <p className="coach-lede">
            Kinseh built his game at the highest level through positioning, reads, and game sense. That is exactly what makes the system teachable.
          </p>
          <div className="coach-principle">
            <span>KINSEH // COACHING PRINCIPLE</span>
            <strong>The right decision means nothing without the mechanics to execute it, and mechanics mean nothing without the judgment to use them.</strong>
          </div>
          <div className="coach-stats">
            <div><strong>0.001%</strong><span>Competed with the top tier of players globally</span></div>
            <div><strong>20K+</strong><span>Hours playing, competing, and coaching</span></div>
            <div><strong>All ranks</strong><span>Experience coaching across modes and skill levels</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
