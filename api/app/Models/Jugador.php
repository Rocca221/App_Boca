<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    protected $table = 'jugadores';

    protected $fillable = [
        'nombre',
        'numero_camiseta',
        'posicion',
        'nacionalidad',
        'titular',
        'fecha_nacimiento',
    ];

    protected function casts(): array
    {
        return [
            'titular' => 'boolean',
            'fecha_nacimiento' => 'date:Y-m-d',
        ];
    }
}
