<?php

namespace App\Http\Controllers;

use App\Models\Jugador;
use Illuminate\Http\Request;

class JugadorController extends Controller
{
    public function index()
    {
        return response()->json(Jugador::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $jugador = Jugador::create($validated);

        return response()->json($jugador, 201);
    }

    public function show(string $id)
    {
        return response()->json(Jugador::findOrFail($id), 200);
    }

    public function update(Request $request, string $id)
    {
        $jugador = Jugador::findOrFail($id);
        $validated = $request->validate($this->rules($request->isMethod('patch')));

        if ($validated === []) {
            return response()->json([
                'message' => 'Debes enviar al menos un campo válido para actualizar.',
            ], 422);
        }

        $jugador->update($validated);

        return response()->json($jugador->refresh(), 200);
    }

    public function destroy(string $id)
    {
        $jugador = Jugador::findOrFail($id);
        $jugador->delete();

        return response()->json([
            'message' => 'Jugador eliminado correctamente.',
        ], 200);
    }


private function rules(bool $partial = false): array
{
    $presence = $partial
        ? ['sometimes', 'required']
        : ['required'];

    return [
        'nombre' => [...$presence, 'string', 'max:255'],
        'numero_camiseta' => [...$presence, 'integer'],
        'posicion' => [...$presence, 'string', 'max:255'],
        'nacionalidad' => [...$presence, 'string', 'max:255'],
        'titular' => [...$presence, 'boolean'],
        'fecha_nacimiento' => [...$presence, 'date'],
    ];
}

}
