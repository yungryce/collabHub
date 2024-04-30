<?php

namespace Tests\Feature\RoleTest;

use App\Models\Role;
use App\Models\User;


it('fetches_user_roles_successfully', function () {
    // Create a user
    $user = User::factory()->create();
    $this->actingAs($user);

    // Retrieve the predefined role from the database
    $role = $user->role()->first();

    // Send a GET request to the endpoint
    $response = $this->get("/api/user/{$user->id}/roles");

    // Assert the response status code is 200 (OK)
    $response->assertStatus(200);

    // Assert that the response contains the correct role for the user
    $response->assertJson([
        'user' => $user->toArray(),
        'roles' => $role->toArray(), // Convert single role to array and put it inside an array
    ]);

    // Create a new user
    $newUser = User::factory()->create();

    // Send a GET request to the endpoint with the new user's ID
    $newResponse = $this->get("/api/user/{$newUser->id}/roles");

    // Assert the response status code is 200 (OK)
    $newResponse->assertStatus(200);

    // Retrieve the role for the new user
    $newRole = $newUser->role()->first();

    // Assert the response contains the new user and its role data correctly
    $newResponse->assertJson([
        'user' => $newUser->toArray(),
        'roles' => $newRole->toArray(), // Note: $newRole is expected to be a single role, not an array
    ]);

});


it('returns 401 unauthorized for unauthenticated user', function () {
    // Create a user
    $user = User::factory()->create();

    // Simulate a request to the index endpoint without authentication
    $response = $this->json('GET', '/api/user/{$user->id}/roles');

    // Assert that the response status is 401 Unauthorized
    $response->assertStatus(401);
});

