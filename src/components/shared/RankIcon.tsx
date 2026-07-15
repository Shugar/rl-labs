import { useState } from "react";
import type { Rank } from "../../data/ranks";

export function RankIcon({ rank, loading = "lazy" }: { rank: Rank; loading?: "eager" | "lazy" }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className={`rank-icon rank-${rank.tone} ${imageFailed ? "rank-image-failed" : ""}`}>
      {!imageFailed && (
        <img
          src={rank.image}
          alt={`${rank.name} rank icon`}
          loading={loading}
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="rank-fallback" aria-hidden="true">
        {rank.short}
      </span>
    </span>
  );
}
