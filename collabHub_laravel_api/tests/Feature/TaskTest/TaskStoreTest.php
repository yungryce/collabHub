<?php

namespace Tests\Feature\TaskTest;

use App\Models\User;


it('creates_a_task_with_valid_data_and_assigns_to_second_user', function () {
    // Create the first user
    $user1 = User::factory()->create();
    $this->actingAs($user1);

    // Create the second user
    $user2 = User::factory()->create();

    // Send a POST request to the store endpoint with valid data and assign the task to the second user
    $response = $this->post('/api/tasks', [
        'title' => 'Test Task',
        'description' => 'This is a test task description',
        'assigned_users' => [$user2->id], // Assign the task to the second user
    ]);

    // Assert that the response status code is 201 (Created)
    $response->assertStatus(201);

    // Assert that the response structure is as expected
    $response->assertJsonStructure([
        'status',
        'message',
        'task',
    ]);

    // Optionally, assert on the task details returned in the response
    $response->assertJson([
        'status' => 'success',
        'message' => 'Task created successfully!',
        'task' => [
            'title' => 'Test Task',
            'description' => 'This is a test task description',
            // Add more assertions as needed
        ],
    ]);
});

it('returns_error_for_invalid_data', function () {
    // Create a user
    $user = User::factory()->create();

    // Authenticate the user
    $this->actingAs($user);

    // Send a POST request to the store endpoint with invalid data (missing title)
    $response = $this->withHeaders([
        'Accept' => 'application/json',
    ])->post('/api/tasks', [
        // 'title' => 'Test Task', // Missing 'title' field
        'description' => 'This is a test task description',
        // 'assigned_users' => [$user->id], // Assign the task to the authenticated user. could be skipped
    ]);

    // Assert that the response status code is 422 (Unprocessable Entity)
    $response->assertStatus(422);

    // Optionally, assert on the structure of the returned JSON error message
    $response->assertJsonStructure([
        'message',
        'errors' => [
            'title',
        ],
    ]);
});