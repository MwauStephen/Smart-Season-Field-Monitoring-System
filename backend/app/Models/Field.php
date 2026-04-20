<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    protected $fillable = [
        'name',
        'crop_type',
        'planting_date',
        'stage',
        'assigned_agent_id',
        'created_by',
    ];

    // Accessor for the 'status' computed attribute
    protected $appends = ['status'];

    public function getStatusAttribute()
    {
        if ($this->stage === 'Harvested') {
            return 'Completed';
        }

        $lastUpdate = $this->updates()->latest('created_at')->first();
        if ($lastUpdate && $lastUpdate->created_at->diffInDays(now()) >= 7) {
            return 'At Risk';
        }

        if (!$lastUpdate && \Carbon\Carbon::parse($this->planting_date)->diffInDays(now()) >= 14) {
             return 'At Risk';
        }

        return 'Active';
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function updates()
    {
        return $this->hasMany(FieldUpdate::class);
    }
}
