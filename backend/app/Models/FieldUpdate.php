<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FieldUpdate extends Model
{
    protected $fillable = [
        'field_id',
        'updated_by',
        'stage',
        'notes',
    ];

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
