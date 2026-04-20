<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Field;
use App\Models\FieldUpdate;
class FieldApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_field()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $agent = User::factory()->create(['role' => 'agent']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/fields', [
            'name' => 'Demo Field',
            'crop_type' => 'Wheat',
            'planting_date' => '2026-04-01',
            'assigned_agent_id' => $agent->id,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('fields', ['name' => 'Demo Field']);
    }

    public function test_agent_cannot_create_field()
    {
        $agent = User::factory()->create(['role' => 'agent']);

        $response = $this->actingAs($agent, 'sanctum')->postJson('/api/fields', [
            'name' => 'Agent Field',
            'crop_type' => 'Corn',
            'planting_date' => '2026-04-01',
            'assigned_agent_id' => $agent->id,
        ]);

        $response->assertStatus(403);
    }

    public function test_agent_can_log_field_update()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $agent = User::factory()->create(['role' => 'agent']);
        
        $field = Field::create([
            'name' => 'Demo Field',
            'crop_type' => 'Wheat',
            'planting_date' => '2026-04-01',
            'stage' => 'Planted',
            'assigned_agent_id' => $agent->id,
            'created_by' => $admin->id,
        ]);

        $response = $this->actingAs($agent, 'sanctum')->postJson("/api/fields/{$field->id}/updates", [
            'stage' => 'Growing',
            'notes' => 'Looking green',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('field_updates', ['stage' => 'Growing']);
        $this->assertDatabaseHas('fields', ['id' => $field->id, 'stage' => 'Growing']);
    }

    public function test_dashboard_stats()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $agent = User::factory()->create(['role' => 'agent']);

        $field = Field::create([
            'name' => 'Demo Field',
            'crop_type' => 'Wheat',
            'planting_date' => now()->subDays(20)->toDateString(),
            'stage' => 'Planted',
            'assigned_agent_id' => $agent->id,
            'created_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/dashboard/stats');
        
        $response->assertStatus(200);
        $response->assertJsonPath('total_fields', 1);
        $response->assertJsonPath('fields_per_status.At Risk', 1); // 20 days old Planted -> At Risk
    }
}
