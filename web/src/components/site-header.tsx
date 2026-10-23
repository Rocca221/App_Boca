import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Boca Players, inicio">
          <span className="brand-mark" aria-hidden="true">
            BP
          </span>
          <span>Boca Players</span>
        </Link>
        <nav aria-label="Navegacion principal">
          <Link href="/">Plantel</Link>
          <a href="#acerca-de">El proyecto</a>
        </nav>
      </div>
    </header>
  );
}
