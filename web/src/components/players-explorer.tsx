"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Player } from "@/lib/players";

type PlayersExplorerProps = {
  players: Player[];
};

export default function PlayersExplorer({ players }: PlayersExplorerProps) {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return players.filter((player) =>
      `${player.nombre} ${player.posicion} ${player.nacionalidad}`
        .toLocaleLowerCase("es")
        .includes(normalizedQuery),
    );
  }, [players, query]);

  function toggleFavorite(playerId: number) {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(playerId)
        ? currentFavorites.filter((id) => id !== playerId)
        : [...currentFavorites, playerId],
    );
  }

  return (
    <section className="roster-section" aria-labelledby="roster-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">El plantel</p>
          <h2 id="roster-title">Jugadores</h2>
        </div>
        <p className="roster-count">
          {filteredPlayers.length}{" "}
          {filteredPlayers.length === 1 ? "perfil" : "perfiles"}
        </p>
      </div>

      <label className="search-label" htmlFor="player-search">
        Buscar por nombre, posicion o nacionalidad
      </label>
      <input
        className="search-input"
        id="player-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ej.: delantero, Argentina..."
        type="search"
        value={query}
      />

      {filteredPlayers.length === 0 ? (
        <p className="notice" role="status">
          No hay jugadores que coincidan con la busqueda.
        </p>
      ) : (
        <ul className="player-grid">
          {filteredPlayers.map((player) => {
            const isFavorite = favorites.includes(player.id);

            return (
              <li className="player-card" key={player.id}>
                <div className="player-card-top">
                  <span className="player-number" aria-label={`Camiseta ${player.numero_camiseta}`}>
                    {player.numero_camiseta}
                  </span>
                  <button
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? `Quitar a ${player.nombre} de favoritos`
                        : `Agregar a ${player.nombre} a favoritos`
                    }
                    className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
                    onClick={() => toggleFavorite(player.id)}
                    type="button"
                  >
                    {isFavorite ? "★ Favorito" : "☆ Favorito"}
                  </button>
                </div>
                <h3>
                  <Link href={`/jugadores/${player.id}`}>{player.nombre}</Link>
                </h3>
                <p className="player-position">{player.posicion}</p>
                <div className="player-card-footer">
                  <span>{player.nacionalidad}</span>
                  <span className="status-badge">
                    {player.titular ? "Titular" : "Suplente"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="favorites-summary" aria-live="polite">
        {favorites.length === 0
          ? "Todavia no marcaste favoritos."
          : `${favorites.length} ${favorites.length === 1 ? "jugador favorito" : "jugadores favoritos"}.`}
      </p>
    </section>
  );
}
