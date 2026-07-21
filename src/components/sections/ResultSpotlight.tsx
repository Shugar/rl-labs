import { memberReviews } from "../../data/proof";
import { Arrow } from "../shared/Arrow";
import "./ResultSpotlight.css";

const featuredResult = memberReviews.find((review) => review.id === "sojh") ?? memberReviews[0];

export function ResultSpotlight() {
  return (
    <section className="result-spotlight" id="result-spotlight" aria-labelledby="result-spotlight-title">
      <div className="result-spotlight-card" data-reveal>
        <div className="result-spotlight-label">
          <span><i /> Member result</span>
          <strong>Verified on Whop</strong>
        </div>

        <div className="result-spotlight-outcome">
          <span>Reported rank progression</span>
          <h2 id="result-spotlight-title">{featuredResult.result}</h2>
          <p>After years stuck in GC3</p>
        </div>

        <div className="result-spotlight-quote">
          <span className="result-time">Reached SSL in 1–2 weeks</span>
          <blockquote>“{featuredResult.spotlightQuote ?? featuredResult.quote}”</blockquote>
          <div className="result-member">
            <span className="result-avatar">
              {featuredResult.avatar ? <img src={featuredResult.avatar} alt="" loading="lazy" /> : featuredResult.initials}
            </span>
            <div>
              <strong>{featuredResult.name}</strong>
              <span>★★★★★ · Verified member</span>
            </div>
          </div>
        </div>

        <a className="result-spotlight-link" href="#programs">
          Find your coaching level <Arrow />
        </a>
      </div>
    </section>
  );
}
