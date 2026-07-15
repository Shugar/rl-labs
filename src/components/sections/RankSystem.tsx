import type { CSSProperties } from "react";
import { ranks } from "../../data/ranks";
import { RankIcon } from "../shared/RankIcon";
import "./RankSystem.css";

export function RankSystem() {
  return (
    <section className="rank-system" id="rank-system" aria-label="Rocket League rank progression">
      <div className="section-kicker">
        <span>Player progression / MMR track</span>
        <span>Bronze → Supersonic Legend</span>
      </div>
      <div className="rank-track" data-reveal>
        <span className="rank-track-line" aria-hidden="true" />
        {ranks.map((rank, index) => (
          <div className="rank-step" key={rank.name} style={{ "--rank-index": index } as CSSProperties}>
            <RankIcon rank={rank} />
            <span>{rank.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
