import PlayersExplorer from "@/components/players-explorer";
import { ApiError, getPlayers } from "@/lib/players";

export default async function PlayersSection() {
  let players;
  let errorMessage: string | null = null;

  try {
    players = await getPlayers();
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Ocurrio un error inesperado al cargar los jugadores.";
  }

  if (errorMessage) {
    return (
      <div className="notice notice-error" role="alert">
        <h2>No pudimos cargar los jugadores</h2>
        <p>{errorMessage}</p>
        <p>
          Comprueba que Laravel este iniciado y que{" "}
          <code>NEXT_PUBLIC_API_URL</code> apunte a su API.
        </p>
      </div>
    );
  }

  return <PlayersExplorer players={players ?? []} />;
}
