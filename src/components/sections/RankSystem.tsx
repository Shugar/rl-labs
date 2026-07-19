import type { CSSProperties } from "react";
import { ranks } from "../../data/ranks";
import { RankIcon } from "../shared/RankIcon";
import "./RankSystem.css";

export function RankSystem() {
  return (
    <section className="rank-system" id="rank-system" aria-label="Rocket League rank progression">
      <div className="section-kicker">
        <span>Player progression / MMR track</span>
        <span className="rank-range">
          <span className="rank-range-full">Bronze → Supersonic Legend</span>
          <span className="rank-range-mobile">Swipe to explore →</span>
        </span>
      </div>
      <div className="rank-scroll" tabIndex={0} aria-label="Swipe or use the arrow keys to explore every Rocket League rank">
        <div className="rank-track" data-reveal>
          <span className="rank-track-line" aria-hidden="true" />
          {ranks.map((rank, index) => (
            <div className="rank-step" key={rank.name} style={{ "--rank-index": index } as CSSProperties}>
              <RankIcon rank={rank} />
              <span>{rank.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
