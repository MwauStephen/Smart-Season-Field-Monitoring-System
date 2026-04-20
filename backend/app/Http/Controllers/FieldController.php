<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function getAllFields(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            $fields = \App\Models\Field::with(['creator', 'agent'])->get();
        } else {
            $fields = \App\Models\Field::with(['creator', 'agent'])
                ->where('assigned_agent_id', $user->id)
                ->get();
        }
        return response()->json($fields);
    }

    public function createNewField(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'crop_type' => 'required|string|max:255',
            'planting_date' => 'required|date',
            'assigned_agent_id' => 'required|exists:users,id',
        ]);

        $field = \App\Models\Field::create([
            'name' => $validated['name'],
            'crop_type' => $validated['crop_type'],
            'planting_date' => $validated['planting_date'],
            'stage' => 'Planted', // default
            'assigned_agent_id' => $validated['assigned_agent_id'],
            'created_by' => $request->user()->id,
        ]);

        return response()->json($field, 201);
    }

    public function getFieldDetails(Request $request, $id)
    {
        $field = \App\Models\Field::with(['creator', 'agent', 'updates'])->findOrFail($id);
        
        if ($request->user()->role !== 'admin' && $field->assigned_agent_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($field);
    }

    public function updateField(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $field = \App\Models\Field::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'crop_type' => 'sometimes|required|string|max:255',
            'planting_date' => 'sometimes|required|date',
            'assigned_agent_id' => 'sometimes|required|exists:users,id',
        ]);

        $field->update($validated);

        return response()->json($field);
    }

    public function deleteField(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $field = \App\Models\Field::findOrFail($id);
        $field->delete();

        return response()->json(['message' => 'Field deleted successfully']);
    }
}
