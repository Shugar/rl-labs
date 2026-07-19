import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ProgramLink } from "../shared/ProgramLink";
import { KineticTitle } from "../shared/KineticTitle";
import "./FitSection.css";

type ProgramKey = "premium" | "elite";

const programVideos: Record<ProgramKey, string> = {
  premium: import.meta.env.VITE_PREMIUM_VIDEO_URL || "https://youtu.be/-TIjHhmqJH4",
  elite: import.meta.env.VITE_ELITE_VIDEO_URL || "https://youtu.be/OVrkg__zzJU",
};

const fitContent = {
  premium: {
    label: "Premium",
    mode: "Group coaching",
    title: "Learn the system. Apply it in your own queue.",
    copy: "Weekly group coaching and the full lesson library give you the same decision framework Kinseh uses with every player—plus a serious community to sharpen it with.",
    bestFor: ["Shared RL Labs system", "Community + group feedback", "Players who execute independently"],
    stat: "24/7",
    statLabel: "lesson access",
    poster: "/programs/premium-video.jpg",
  },
  elite: {
    label: "Elite",
    mode: "Private coaching",
    title: "Build the routine around your game.",
    copy: "Kinseh diagnoses your highest-leverage changes, turns them into a personalized weekly routine, and stays closer to the implementation with private sessions and direct feedback.",
    bestFor: ["Personalized training routine", "Direct, ongoing feedback", "Maximum accountability + support"],
    stat: "2×",
    statLabel: "private sessions weekly",
    poster: "/programs/elite-video.jpg",
  },
} as const;

function toEmbedUrl(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname.includes("youtu.be")) return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return source;
  }
  return source;
}

function isDirectVideo(source: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(source);
}

export function FitSection() {
  const [activeFit, setActiveFit] = useState<ProgramKey>("premium");
  const [activeVideo, setActiveVideo] = useState<ProgramKey | null>(null);
  const fit = fitContent[activeFit];
  const videoSource = activeVideo ? programVideos[activeVideo] : "";

  useEffect(() => {
    if (!activeVideo) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeVideo]);

  return (
    <section className="fit-section section-pad" id="program-preview">
      <div className="fit-heading" data-reveal>
        <p className="eyebrow">Inside the programs</p>
        <KineticTitle lines={[{ text: "See how each program feels." }]} />
        <p>Pricing gives you the overview. This is the closer look at the coaching rhythm, feedback loop, and level of support.</p>
      </div>

      <div className="fit-switcher" data-reveal>
        <div className="fit-tabs" role="tablist" aria-label="Preview Premium and Elite">
          {(["premium", "elite"] as const).map((key) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeFit === key}
              className={activeFit === key ? "active" : ""}
              onClick={() => setActiveFit(key)}
              key={key}
            >
              <span>{key === "premium" ? "01" : "02"}</span>
              {fitContent[key].label}
              <small>{fitContent[key].mode}</small>
            </button>
          ))}
        </div>

        <div className={`fit-panel fit-panel-${activeFit}`} key={activeFit}>
          <div className="fit-media">
            <button
              type="button"
              className="program-video-card"
              onClick={() => programVideos[activeFit] && setActiveVideo(activeFit)}
              disabled={!programVideos[activeFit]}
              aria-label={programVideos[activeFit] ? `Play the ${fit.label} program video` : `${fit.label} program video coming soon`}
            >
              <img className="video-poster" src={fit.poster} alt="" loading="lazy" />
              <span className="video-hud"><i /> PROGRAM PREVIEW / {fit.label.toUpperCase()}</span>
              <span className="video-play" aria-hidden="true">▶</span>
              <span className="video-caption">
                <strong>{fit.mode}</strong>
                <small>{programVideos[activeFit] ? "Play the program film" : "Program video coming soon"}</small>
              </span>
            </button>
          </div>

          <div className="fit-copy">
            <span className="micro-label">PROGRAM FEEL / {fit.mode.toUpperCase()}</span>
            <h3>{fit.title}</h3>
            <p>{fit.copy}</p>
            <div className="fit-spec">
              <div className="fit-stat"><strong>{fit.stat}</strong><span>{fit.statLabel}</span></div>
              <div>
                <p>Best for</p>
                <ul>{fit.bestFor.map((item) => <li key={item}><span>↗</span>{item}</li>)}</ul>
              </div>
            </div>
            <ProgramLink plan={activeFit} variant={activeFit === "premium" ? "primary" : "outline"} />
          </div>
        </div>
      </div>

      {activeVideo && videoSource && createPortal(
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={`${fitContent[activeVideo].label} program video`} onMouseDown={(event) => {
          if (event.currentTarget === event.target) setActiveVideo(null);
        }}>
          <div className="video-modal-shell">
            <div className="video-modal-head">
              <span>{fitContent[activeVideo].label} / PROGRAM PREVIEW</span>
              <button type="button" onClick={() => setActiveVideo(null)} aria-label="Close video">×</button>
            </div>
            <div className="video-modal-frame">
              {isDirectVideo(videoSource) ? (
                <video src={videoSource} controls autoPlay preload="metadata" />
              ) : (
                <iframe
                  src={toEmbedUrl(videoSource)}
                  title={`${fitContent[activeVideo].label} program video`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
