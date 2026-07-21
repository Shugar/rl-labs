import { useEffect } from "react";
import { Topbar } from "./components/sections/Topbar";
import { Hero } from "./components/sections/Hero";
import { BroadcastTicker } from "./components/sections/BroadcastTicker";
import { RankSystem } from "./components/sections/RankSystem";
import { ProblemSection } from "./components/sections/ProblemSection";
import { MethodSection } from "./components/sections/MethodSection";
import { ResultSpotlight } from "./components/sections/ResultSpotlight";
import { CoachSection } from "./components/sections/CoachSection";
import { ProgramsSection } from "./components/sections/ProgramsSection";
import { FitSection } from "./components/sections/FitSection";
import { ProofSection } from "./components/sections/ProofSection";
import { FinalCta } from "./components/sections/FinalCta";
import { FaqSection } from "./components/sections/FaqSection";
import { Footer } from "./components/sections/Footer";

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -5%" },
    );
    elements.forEach((element) => observer.observe(element));

    // Mobile browsers can move a long way during an anchored or inertial
    // scroll without delivering every intermediate intersection. Keep a
    // lightweight, frame-throttled fallback so content that lands in the
    // viewport never remains transparent.
    let revealFrame = 0;
    const revealVisibleElements = () => {
      cancelAnimationFrame(revealFrame);
      revealFrame = requestAnimationFrame(() => {
        elements.forEach((element) => {
          if (element.classList.contains("is-visible")) return;
          const bounds = element.getBoundingClientRect();
          if (bounds.bottom > 0 && bounds.top < window.innerHeight * 0.95) {
            element.classList.add("is-visible");
            observer.unobserve(element);
          }
        });
      });
    };

    let hashFrame = 0;
    const navigateToHash = () => {
      revealVisibleElements();
      cancelAnimationFrame(hashFrame);
      hashFrame = requestAnimationFrame(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;
        const target = document.getElementById(hash);
        target?.scrollIntoView({ block: "start" });
      });
    };

    navigateToHash();
    window.addEventListener("scroll", revealVisibleElements, { passive: true });
    window.addEventListener("hashchange", navigateToHash);

    return () => {
      cancelAnimationFrame(revealFrame);
      cancelAnimationFrame(hashFrame);
      window.removeEventListener("scroll", revealVisibleElements);
      window.removeEventListener("hashchange", navigateToHash);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="site-shell">
      <Topbar />
      <main>
        <Hero />
        <BroadcastTicker />
        <ProblemSection />
        <MethodSection />
        <ResultSpotlight />
        <ProgramsSection />
        <CoachSection />
        <RankSystem />
        <ProofSection />
        <FitSection />
        <FinalCta />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
