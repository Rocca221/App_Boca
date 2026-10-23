export type Player = {
  id: number;
  nombre: string;
  numero_camiseta: number;
  posicion: string;
  nacionalidad: string;
  titular: boolean;
  fecha_nacimiento: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getPlayersEndpoint(path = ""): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError(
      "Falta configurar NEXT_PUBLIC_API_URL en el archivo .env.local.",
    );
  }

  return `${baseUrl.replace(/\/+$/, "")}/jugadores${path}`;
}

function isPlayer(value: unknown): value is Player {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const player = value as Record<string, unknown>;

  return (
    typeof player.id === "number" &&
    typeof player.nombre === "string" &&
    typeof player.numero_camiseta === "number" &&
    typeof player.posicion === "string" &&
    typeof player.nacionalidad === "string" &&
    typeof player.titular === "boolean" &&
    typeof player.fecha_nacimiento === "string"
  );
}

async function requestJson(endpoint: string): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(endpoint, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(
        "No se pudo conectar con Laravel. Comprueba que el servidor API este iniciado.",
      );
    }

    throw error;
  }

  if (!response.ok) {
    throw new ApiError(
      `La API respondio con el codigo HTTP ${response.status}.`,
      response.status,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("La API no devolvio una respuesta JSON valida.");
  }
}

export async function getPlayers(): Promise<Player[]> {
  const data = await requestJson(getPlayersEndpoint());

  if (!Array.isArray(data) || !data.every(isPlayer)) {
    throw new ApiError("La respuesta de la API no tiene el formato esperado.");
  }

  return data;
}

export async function getPlayer(id: string): Promise<Player> {
  const data = await requestJson(getPlayersEndpoint(`/${encodeURIComponent(id)}`));

  if (!isPlayer(data)) {
    throw new ApiError("El perfil recibido de la API no tiene el formato esperado.");
  }

  return data;
}
