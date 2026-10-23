<?php

namespace Tests\Feature;

use App\Models\Jugador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JugadorApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_and_shows_players(): void
    {
        $jugador = $this->createJugador();

        $this->getJson('/api/jugadores')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.nombre', 'Juan Román Riquelme');

        $this->getJson("/api/jugadores/{$jugador->id}")
            ->assertOk()
            ->assertJsonPath('id', $jugador->id)
            ->assertJsonPath('fecha_nacimiento', '1978-06-24');
    }

    public function test_it_creates_updates_and_deletes_a_player(): void
    {
        $payload = [
            'nombre' => 'Carlos Tevez',
            'numero_camiseta' => 10,
            'posicion' => 'Delantero',
            'nacionalidad' => 'Argentina',
            'titular' => true,
            'fecha_nacimiento' => '1984-02-05',
        ];

        $created = $this->postJson('/api/jugadores', $payload)
            ->assertCreated()
            ->assertJsonPath('nombre', 'Carlos Tevez');

        $id = $created->json('id');

        $this->patchJson("/api/jugadores/{$id}", ['numero_camiseta' => 32])
            ->assertOk()
            ->assertJsonPath('numero_camiseta', 32)
            ->assertJsonPath('nombre', 'Carlos Tevez');

        $this->deleteJson("/api/jugadores/{$id}")
            ->assertOk()
            ->assertJsonPath('message', 'Jugador eliminado correctamente.');

        $this->assertDatabaseMissing('jugadores', ['id' => $id]);
    }

    public function test_it_returns_validation_and_not_found_errors_as_json(): void
    {
        $this->postJson('/api/jugadores', ['nombre' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'nombre',
                'numero_camiseta',
                'posicion',
                'nacionalidad',
                'titular',
                'fecha_nacimiento',
            ]);

        $this->getJson('/api/jugadores/9999')->assertNotFound();
        $this->putJson('/api/jugadores/9999', [])->assertNotFound();
        $this->deleteJson('/api/jugadores/9999')->assertNotFound();
    }

    public function test_it_rejects_an_empty_partial_update(): void
    {
        $jugador = $this->createJugador();

        $this->patchJson("/api/jugadores/{$jugador->id}", [])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Debes enviar al menos un campo válido para actualizar.');
    }

    private function createJugador(): Jugador
    {
        return Jugador::create([
            'nombre' => 'Juan Román Riquelme',
            'numero_camiseta' => 10,
            'posicion' => 'Mediocampista',
            'nacionalidad' => 'Argentina',
            'titular' => true,
            'fecha_nacimiento' => '1978-06-24',
        ]);
    }
}
