import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark">▶</span>
        <span className="brand-name">
          Stream<span className="brand-accent">Lab</span>
        </span>
      </Link>

      <nav className="site-nav">
        <NavLink to="/" end className="nav-link">
          Library
        </NavLink>
        <NavLink to="/upload" className="nav-link nav-link--cta">
          + Upload
        </NavLink>
      </nav>
    </header>
  );
}
