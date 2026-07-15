import { useEffect } from "react";
import { Topbar } from "./components/sections/Topbar";
import { Hero } from "./components/sections/Hero";
import { BroadcastTicker } from "./components/sections/BroadcastTicker";
import { RankSystem } from "./components/sections/RankSystem";
import { ProblemSection } from "./components/sections/ProblemSection";
import { MethodSection } from "./components/sections/MethodSection";
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
      return;
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
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <Topbar />
      <main>
        <Hero />
        <BroadcastTicker />
        <RankSystem />
        <ProblemSection />
        <MethodSection />
        <CoachSection />
        <ProgramsSection />
        <FitSection />
        <ProofSection />
        <FinalCta />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
