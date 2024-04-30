<?php

namespace Tests\Feature\TaskTest;


use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\put;


it('updates task details successfully for authorized user', function () {
    // Given an authenticated user
    $user = User::factory()->create();
    Auth::login($user);

    // And a task owned by the user
    $task = Task::factory()->create();

    // Attach the user to the task using the pivot table
    $task->users()->attach($user->id);

    // When sending a request to update the task details
    $response = $this->putJson("api/tasks/{$task->id}", [
        'title' => 'Updated Task Title',
        'description' => 'Updated task description',
        'status' => 'close',
    ]);

    // Then the response should indicate success
    $response->assertStatus(200)
             ->assertJson([
                 'status' => 'success',
                 'message' => 'Task details updated successfully.',
             ]);

    // And the task details should be updated in the database
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated Task Title',
        'description' => 'Updated task description',
        'status' => 'close',
    ]);
});


it('updates task details successfully for authorized user with assigned users', function () {
    // Given an authenticated user
    $user = User::factory()->create();
    Auth::login($user);

    // And a task owned by the user
    $task = Task::factory()->create();

    // And other users assigned to the task
    $assignedUsers = User::factory()->count(2)->create();

    // When sending a request to update the task details
    $response = $this->put("/api/tasks/{$task->id}", [
        'title' => 'Updated Task Title',
        'description' => 'Updated task description',
        'status' => 'done',
        'assigned_users' => $assignedUsers->pluck('id')->toArray(),
    ]);

    // Then the response should indicate success
    $response->assertStatus(200)
             ->assertJson([
                 'status' => 'success',
                 'message' => 'Task details updated successfully.',
             ]);

    // And the task details should be updated in the database
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated Task Title',
        'description' => 'Updated task description',
        'status' => 'done',
    ]);

    // And the assigned users should remain attached to the task
    foreach ($assignedUsers as $assignedUser) {
        $this->assertDatabaseHas('task_user', [
            'task_id' => $task->id,
            'user_id' => $assignedUser->id,
        ]);
    }
});


it('returns unauthorized error for unauthorized user', function () {
    // Create a task
    $task = Task::factory()->create();

    // Create users with different roles
    $adminUser = User::factory()->create(['role_id' => 1]); // Assuming role_id 1 is 'admin'
    $regularUser = User::factory()->create(['role_id' => 3]); // Assuming role_id 3 is 'regular'

    // Attach both users to the task
    $task->users()->attach([$adminUser->id, $regularUser->id]);
    $this->actingAs($regularUser);

    // When sending a request to update the task details
    $response = $this->putJson("api/tasks/{$task->id}", [
        'title' => 'Updated Task Title',
        'description' => 'Updated task description',
        'status' => 'close',
    ]);

    // Then the response should indicate unauthorized error
    $response->assertStatus(403)
             ->assertJson(['error' => 'Unauthorized']);
});