import { BrandMark } from "../shared/BrandMark";
import { Button } from "../shared/Button";
import "./Footer.css";

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#top" className="brand" aria-label="RL Labs home">
            <BrandMark />
            <span className="brand-type">RL<span>.</span>LABS</span>
          </a>
          <p>Structure beats hours. A ranked performance lab for players who want the climb to be repeatable.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <span>Explore</span>
          <a href="#method">Method</a>
          <a href="#coach">Coach</a>
          <a href="#programs">Programs</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="footer-cta">
          <span className="micro-label">NEXT QUEUE / 01</span>
          <strong>Queue with<br />intent.</strong>
          <Button href="#programs" variant="primary">
            Find your path
          </Button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} RL Labs</span>
        <p>Rocket League, Psyonix, and related marks are property of their respective owners. RL Labs is an independent coaching service and is not affiliated with or endorsed by Psyonix or Epic Games.</p>
      </div>
    </footer>
  );
}
