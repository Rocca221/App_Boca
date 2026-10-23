import Link from "next/link";

export default function PlayerNotFound() {
  return (
    <main className="page-shell">
      <div className="notice">
        <p className="eyebrow">404 · Perfil no encontrado</p>
        <h1>No encontramos ese jugador.</h1>
        <p>Puede que el perfil ya no exista o que el enlace sea incorrecto.</p>
        <Link className="button-link" href="/">
          Volver al plantel
        </Link>
      </div>
    </main>
  );
}
