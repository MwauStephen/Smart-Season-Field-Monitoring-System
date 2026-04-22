<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getDashboardStats(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $fields = \App\Models\Field::get();
            $recentUpdates = \App\Models\FieldUpdate::with(['field', 'updater'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'total_fields' => $fields->count(),
                'fields_per_stage' => $fields->groupBy('stage')->map->count(),
                'fields_per_status' => $fields->groupBy('status')->map->count(),
                'recent_updates' => $recentUpdates,
            ]);
        }

        // Agent logic
        $assignedFields = \App\Models\Field::with('creator')
            ->where('assigned_agent_id', $user->id)
            ->get();

        return response()->json([
            'total_fields' => $assignedFields->count(),
            'fields_per_status' => $assignedFields->groupBy('status')->map->count(),
            'fields_per_stage' => $assignedFields->groupBy('stage')->map->count(),
            'assigned_fields' => $assignedFields,
        ]);
    }
}
