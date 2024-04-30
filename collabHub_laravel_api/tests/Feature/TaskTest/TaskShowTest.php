<?php

namespace Tests\Feature\TaskTest;


use App\Models\Task;
use App\Models\User;
use function Pest\Laravel\get;


it('returns_401_for_unauthenticated_user', function () {
    // Create a task
    $task = Task::factory()->create();

    // Send a GET request to the show endpoint without authentication
    $response = $this->withHeaders([
        'Accept' => 'application/json',
    ])->get("/api/tasks/{$task->id}");

    // Assert that the response status code is 401 (Unauthorized)
    $response->assertStatus(401);
});


it('returns a task if it exists', function () {
    // Mock an authenticated user
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create a task
    $task = Task::factory()->create();

    // Associate the task with the authenticated user through the pivot table
    $user->tasks()->attach($task);

    // Send a GET request to the show endpoint with the task ID
    $response = get("/api/tasks/{$task->id}");

    // Assert that the response status code is 200 (OK)
    $response->assertStatus(200);

    // Assert that the response structure is as expected
    $response->assertJsonStructure([
        'status',
        'task',
    ]);

    // Assert that the response contains the correct task data
    $response->assertJson([
        'status' => 'success',
        'task' => $task->toArray(),
    ]);
});


it('returns_an_error_if_the_task_does_not_exist', function ()
{
    // Create a user
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create a task
    $task = Task::factory()->create();

    // Attach the task to the user through the pivot table
    $user->tasks()->attach($task);

    // Delete the task to ensure it doesn't exist
    $task_id = $task->id;
    $task->delete();

    // Now, when you use $task->id, it refers to a deleted (non-existent) task
    $response = $this->withHeaders([
        'Accept' => 'application/json',
    ])->get("/api/tasks/{$task_id}");

    // Assert that the response status code is 404 (Not Found)
    $response->assertStatus(404);

    // Optionally, assert on the structure of the returned JSON
    $response->assertJsonStructure([
        'message',
    ]);
});