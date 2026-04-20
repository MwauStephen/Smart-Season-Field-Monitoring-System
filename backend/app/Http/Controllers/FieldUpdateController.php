<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FieldUpdateController extends Controller
{
    public function getFieldHistory(Request $request, $fieldId)
    {
        $field = \App\Models\Field::findOrFail($fieldId);

        if ($request->user()->role !== 'admin' && $field->assigned_agent_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $updates = \App\Models\FieldUpdate::with('updater')
            ->where('field_id', $fieldId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($updates);
    }

    public function logFieldUpdate(Request $request, $fieldId)
    {
        $field = \App\Models\Field::findOrFail($fieldId);

        if ($request->user()->role !== 'admin' && $field->assigned_agent_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'stage' => 'required|string|in:Planted,Growing,Ready,Harvested',
            'notes' => 'nullable|string',
        ]);

        $update = \App\Models\FieldUpdate::create([
            'field_id' => $field->id,
            'updated_by' => $request->user()->id,
            'stage' => $validated['stage'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update the base field stage
        $field->update(['stage' => $validated['stage']]);

        return response()->json($update, 201);
    }
}
