import { ProgramLink } from "../shared/ProgramLink";
import { KineticTitle } from "../shared/KineticTitle";
import "./FaqSection.css";

const faqs = [
  {
    question: "Do I need elite mechanics to benefit?",
    answer:
      "No. The system is built around decision quality, positioning, boost control, and reading the field. Mechanics matter, but they are trained in service of better decisions—not as disconnected clips.",
  },
  {
    question: "What is the difference between Premium and Elite?",
    answer:
      "Premium is the self-paced group program: lessons, live sessions, replay reviews, and community. Elite adds a personalized plan, two private coaching sessions each week, direct access, and tighter accountability.",
  },
  {
    question: "Which ranks and modes does RL Labs support?",
    answer:
      "The framework applies across ranks and core game modes because it focuses on universal indicators: opponents, boost, and teammates. Your drills and priorities are then calibrated to your current level.",
  },
  {
    question: "What happens after I join?",
    answer:
      "Community and Premium players receive access to their program resources and schedule. Elite applicants begin with a fit check so expectations, goals, and coaching capacity are aligned before enrollment.",
  },
  {
    question: "How does the Elite guarantee work?",
    answer:
      "Elite is positioned around measurable improvement, not vague promises. Eligibility, participation requirements, measurement windows, and refund terms should be confirmed in the written agreement supplied during application.",
  },
];

export function FaqSection() {
  return (
    <section className="faq-section section-pad" id="faq">
      <div className="faq-layout">
        <div className="faq-heading" data-reveal>
          <p className="eyebrow dark-eyebrow">Clear comms only</p>
          <KineticTitle
            lines={[
              { text: "Frequently" },
              { text: "Asked questions." },
            ]}
          />
          <p>Still unsure which path fits? Start with the free community and see how the system thinks.</p>
          <ProgramLink plan="free" className="inline-link" />
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary><span>0{index + 1}</span>{faq.question}<i>+</i></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
