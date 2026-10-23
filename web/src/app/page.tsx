import { Suspense } from "react";
import PlayersSection from "@/components/players-section";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Historia y presente</p>
        <h1 id="page-title">Los jugadores que hacen grande a Boca.</h1>
        <p className="hero-copy">
          Explora sus perfiles, conoce sus posiciones y arma tu lista de
          favoritos.
        </p>
      </section>
      <Suspense
        fallback={
          <p className="notice" role="status">
            Cargando jugadores...
          </p>
        }
      >
        <PlayersSection />
      </Suspense>
    </main>
  );
}
