import "./BroadcastTicker.css";

export function BroadcastTicker() {
  return (
    <div className="broadcast-ticker" aria-hidden="true">
      {/* Track animates by -50%; each half must be wider than any viewport, so
          the six items are repeated four times per half (8 groups total). */}
      <div className="ticker-track">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((group) => (
          <div className="ticker-group" key={group}>
            <span>VOD REVIEW</span><i />
            <span>FIELD READS</span><i />
            <span>ROTATION</span><i />
            <span>BOOST CONTROL</span><i />
            <span>RECOVERY</span><i />
            <span>QUEUE WITH INTENT</span><i />
          </div>
        ))}
      </div>
    </div>
  );
}
