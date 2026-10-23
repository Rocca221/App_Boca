<?php

namespace Database\Seeders;

use App\Models\Jugador;
use Illuminate\Database\Seeder;

class JugadorSeeder extends Seeder
{
    public function run(): void
    {
        // Verificar fecha, camiseta, posicion y titularidad con una fuente confiable.
        $jugadores = [
            [
                'nombre' => 'Juan Román Riquelme',
                'numero_camiseta' => 10,
                'posicion' => 'Mediocampista',
                'nacionalidad' => 'Argentina',
                'titular' => true,
                'fecha_nacimiento' => '1978-06-24',
            ],
            [
                'nombre' => 'Martín Palermo',
                'numero_camiseta' => 9,
                'posicion' => 'Delantero',
                'nacionalidad' => 'Argentina',
                'titular' => true,
                'fecha_nacimiento' => '1973-11-07',
            ],
            [
                'nombre' => 'Sebastián Battaglia',
                'numero_camiseta' => 5,
                'posicion' => 'Mediocampista',
                'nacionalidad' => 'Argentina',
                'titular' => true,
                'fecha_nacimiento' => '1980-11-08',
            ],
            [
                'nombre' => 'Hugo Ibarra',
                'numero_camiseta' => 4,
                'posicion' => 'Defensor',
                'nacionalidad' => 'Argentina',
                'titular' => true,
                'fecha_nacimiento' => '1974-04-01',
            ],
            [
                'nombre' => 'Carlos Tévez',
                'numero_camiseta' => 10,
                'posicion' => 'Delantero',
                'nacionalidad' => 'Argentina',
                'titular' => true,
                'fecha_nacimiento' => '1984-02-05',
            ],
        ];

        foreach ($jugadores as $jugador) {
            Jugador::updateOrCreate(
                ['nombre' => $jugador['nombre']],
                $jugador,
            );
        }
    }
}
