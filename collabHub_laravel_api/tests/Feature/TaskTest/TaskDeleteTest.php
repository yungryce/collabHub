<?php

namespace Tests\Feature\TaskTest;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\delete;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

uses(DatabaseTransactions::class);

test('authorized_user_can_delete_task', function () {
    // Create a user with appropriate role
    $user = User::factory()->create(['role_id' => 1]); // Assuming role_id 1 is 'admin'
    $this->actingAs($user);

    // Create a task
    $task = Task::factory()->create();

    // Delete the task
    $response = $this->delete("api/tasks/{$task->id}");

    // Assert the response
    $response->assertStatus(200)
             ->assertJson([
                 'status' => 'success',
                 'message' => 'Task deleted successfully'
             ]);

    // Assert that the task is deleted from the database
    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

test('unauthorized_user_cannot_delete_task', function () {
    // Create a task
    $task = Task::factory()->create();

    // Create users with different roles
    $adminUser = User::factory()->create(['role_id' => 1]); // Assuming role_id 1 is 'admin'
    $regularUser = User::factory()->create(['role_id' => 3]); // Assuming role_id 3 is 'regular'

    // Attach both users to the task
    $task->users()->attach([$adminUser->id, $regularUser->id]);
    $this->actingAs($regularUser);

    // Attempt to delete the task
    $response = $this->delete("api/tasks/{$task->id}");

    // Assert the response
    $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Unauthorized to delete task'
            ]);

    // Assert that the task is not deleted from the database
    $this->assertDatabaseHas('tasks', ['id' => $task->id]);
});


