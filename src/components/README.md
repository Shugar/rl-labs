# Component structure

One component per page section, with its stylesheet co-located next to it. Each
section can be edited independently without touching the rest of the page.

```
src/
  App.tsx                    Page composition + the [data-reveal] scroll observer
  styles/global.css          Tokens, reset, typography, primitives shared by 2+ sections
  data/                      Shared data (ranks, program links)
  components/
    shared/                  BrandMark, Arrow, Button (+Button.css), RankIcon, ProgramLink
    sections/                One .tsx + .css pair per page section, in page order:
      Topbar, Hero, BroadcastTicker, RankSystem, ProblemSection, MethodSection,
      CoachSection, ProgramsSection, FitSection, ProofSection, FinalCta,
      FaqSection, Footer
```

## Rules for editing

- **Section-specific styles** go in that section's `.css` file. Data used by
  only one section (plans, FAQs, method tabs, fit content) lives inside its
  component file.
- **`styles/global.css`** is loaded first; only put a rule there if its
  selector is used by two or more sections (buttons, `.eyebrow`, headings,
  `.section-pad`, `.rank-icon`, the method/fit tabs, scanline overlays, shared
  media queries). Section CSS loads after global, so it can override it.
- **Cascade order inside a section file matters**: base rules first, then the
  "Esports broadcast pass" overrides, then media queries. Several selectors are
  defined twice on purpose — the later definition is a same-specificity
  override. Don't merge or reorder them.
- The reveal-on-scroll animation works by adding `data-reveal` to any element;
  the observer in `App.tsx` and the styles in `global.css` handle the rest.
