import { Fragment, useEffect, useState } from "react";
import { BrandMark } from "../shared/BrandMark";
import { Button } from "../shared/Button";
import "./Topbar.css";

const NAV = [
  { href: "#method", label: "Method" },
  { href: "#coach", label: "Coach" },
  { href: "#programs", label: "Programs" },
  { href: "#faq", label: "FAQ" },
];

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "topbar is-scrolled" : "topbar"}>
      <div className="topbar-main">
        <a href="#top" className="brand" aria-label="RL Labs home">
          <BrandMark />
          <span className="brand-type">RL<span>.</span>LABS</span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          {NAV.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 && <i aria-hidden="true">&#9670;</i>}
              <a href={item.href}>{item.label}</a>
            </Fragment>
          ))}
        </nav>
        <Button href="#programs" size="sm" className="nav-cta">
          Find your path
        </Button>
      </div>
    </header>
  );
}
