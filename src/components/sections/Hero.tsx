import { Button } from "../shared/Button";
import { KineticTitle } from "../shared/KineticTitle";
import { RankIcon } from "../shared/RankIcon";
import { ranks } from "../../data/ranks";
import { HeroWebGL } from "./HeroWebGL";
import "./Hero.css";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-backdrop" aria-hidden="true">
        <HeroWebGL />
      </div>
      <div className="hero-copy" data-reveal>
        <p className="eyebrow"><span>●</span> Ranked performance lab online</p>
        <KineticTitle
          as="h1"
          lines={[
            { text: "Stop guessing." },
            { text: "Start ranking up.", accent: true },
          ]}
        />
        <p className="hero-lede">
          Rocket League coaching built by a former pro who has reached SSL 25+ times—to make your decisions faster, your playstyle harder to read, and your climb repeatable.
        </p>
        <div className="hero-actions">
          <Button href="#programs" variant="primary">
            Explore coaching plans
          </Button>
          <a className="text-link" href="#testimonials">
            See member results <span className="play-dot">▶</span>
          </a>
        </div>
        <div className="hero-proof" aria-label="Coach credentials">
          <div><strong>25+</strong><span>Times at SSL</span></div>
          <div><strong>20K+</strong><span>Hours in-game</span></div>
          <div><strong>10+</strong><span>Years competing</span></div>
        </div>
      </div>

      <div className="hero-visual" data-reveal>
        <div className="telemetry-card">
          <div className="telemetry-head">
            <span>VOD review // Match 0472</span>
            <span className="live-signal"><i /> Coach feed active</span>
          </div>
          <div className="scorebug" aria-label="Replay score and time">
            <span className="score-side orange-side">ORANGE <strong>02</strong></span>
            <time>02:43</time>
            <span className="score-side blue-side"><strong>02</strong> BLUE</span>
          </div>
          <div className="rank-brief">
            <div className="brief-rank current-rank">
              <RankIcon rank={ranks[3]} loading="eager" />
              <div>
                <span className="micro-label">Current read</span>
                <strong>PLATINUM III</strong>
              </div>
            </div>
            <svg className="promotion-arrow" viewBox="0 0 60 16" aria-hidden="true">
              <line x1="2" y1="8" x2="46" y2="8" />
              <path d="M44 2 L54 8 L44 14" fill="none" />
            </svg>
            <div className="brief-rank target-destination">
              <div>
                <span className="micro-label">Target protocol</span>
                <strong>SUPERSONIC<br />LEGEND</strong>
              </div>
              <RankIcon rank={ranks[7]} loading="eager" />
            </div>
          </div>
          <div className="trajectory-chart" aria-hidden="true">
            <svg viewBox="0 0 600 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGlow" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#ff4d18" />
                  <stop offset="0.41" stopColor="#ffa53d" />
                  <stop offset="0.44" stopColor="#f4f1e6" />
                  <stop offset="0.47" stopColor="#52b8ff" />
                  <stop offset="1" stopColor="#d9ff54" />
                </linearGradient>
                <linearGradient id="fillGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ff6425" stopOpacity=".17" />
                  <stop offset="0.47" stopColor="#52b8ff" stopOpacity=".08" />
                  <stop offset="1" stopColor="#d8ff4f" stopOpacity=".13" />
                </linearGradient>
              </defs>
              <g className="chart-grid">
                {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="220" />
                ))}
                {[55, 110, 165].map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} />
                ))}
              </g>
              <path className="chart-area" d="M0 184 C70 177 98 161 147 168 C201 177 221 130 278 139 C333 149 360 100 411 110 C468 121 491 58 600 32 L600 220 L0 220Z" />
              <path className="chart-line" d="M0 184 C70 177 98 161 147 168 C201 177 221 130 278 139 C333 149 360 100 411 110 C468 121 491 58 600 32" />
              <line className="event-stem" x1="182" y1="166" x2="182" y2="121" />
              <line className="event-stem" x1="486" y1="85" x2="486" y2="40" />
              <line className="chart-playhead" x1="600" y1="32" x2="600" y2="220" />
            </svg>
            <i className="chart-endpoint" aria-hidden="true" />
            <i className="event-marker marker-one" aria-hidden="true" />
            <i className="event-marker marker-two" aria-hidden="true" />
            <span className="chart-event event-one">LATE CHALLENGE</span>
            <span className="chart-event event-two">SPACING CORRECTED</span>
            <span className="axis-label axis-start">REPLAY 01</span>
            <span className="axis-label axis-end">DECISION MODEL LOCKED</span>
          </div>
          <div className="coach-callout">
            <span>KINSEH // LIVE COMMS</span>
            <strong>Hold second man. Read the clear.</strong>
          </div>
          <div className="telemetry-foot">
            <span><i className="status-dot orange" /> Read</span>
            <span><i className="status-dot blue" /> Decide</span>
            <span><i className="status-dot lime" /> Execute</span>
          </div>
        </div>
      </div>
    </section>
  );
}
