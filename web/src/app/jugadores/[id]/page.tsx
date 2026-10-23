import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getPlayer } from "@/lib/players";

type PlayerPageProps = {
  params: Promise<{ id: string }>;
};

export const instant = false;

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  let player;
  let errorMessage: string | null = null;

  try {
    player = await getPlayer(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Ocurrio un error inesperado al cargar el perfil.";
  }

  return (
    <main className="page-shell">
      <Link className="back-link" href="/">
        Volver al plantel
      </Link>
      {errorMessage ? (
        <div className="notice notice-error" role="alert">
          <h1>No pudimos cargar este perfil</h1>
          <p>{errorMessage}</p>
          <p>
            Comprueba que Laravel este iniciado y que{" "}
            <code>NEXT_PUBLIC_API_URL</code> apunte a su API.
          </p>
        </div>
      ) : player ? (
        <article className="profile-card">
          <p className="eyebrow">Perfil del jugador</p>
          <div className="profile-heading">
            <div className="player-number profile-number" aria-hidden="true">
              {player.numero_camiseta}
            </div>
            <div>
              <h1>{player.nombre}</h1>
              <p className="profile-position">{player.posicion}</p>
            </div>
          </div>
          <dl className="profile-details">
            <div>
              <dt>Nacionalidad</dt>
              <dd>{player.nacionalidad}</dd>
            </div>
            <div>
              <dt>Fecha de nacimiento</dt>
              <dd>
                <time dateTime={player.fecha_nacimiento}>
                  {player.fecha_nacimiento}
                </time>
              </dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{player.titular ? "Titular" : "Suplente"}</dd>
            </div>
            <div>
              <dt>Numero de camiseta</dt>
              <dd>{player.numero_camiseta}</dd>
            </div>
          </dl>
        </article>
      ) : null}
    </main>
  );
}
