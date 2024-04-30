<?php

namespace Tests\Feature\TaskTest;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;


it('returns 200 for a user\'s tasks', function () {
    // Fetch a user from seeded data
    $user = User::factory()->create();

    // Mock the authenticated user for the request.
    $this->actingAs($user);

    // Simulate a request to the index endpoint with a different user ID.
    $response = $this->json('GET', '/api/tasks');

    // Assert that the response status is 401 Unauthorized
    $response->assertStatus(200);
});


it('returns 401 unauthorized for unauthenticated user', function () {
    // Simulate a request to the index endpoint without authentication
    $response = $this->json('GET', '/api/tasks');

    // Assert that the response status is 401 Unauthorized
    $response->assertStatus(401);
});



it('returns 401 unauthorized for user without authentication', function () {
    // Create a new user without authenticating
    $user = User::factory()->create();

    // Simulate a request to the index endpoint without authentication
    $response = $this->json('GET', '/api/tasks');

    // Assert that the response status is 401 Unauthorized
    $response->assertStatus(401);
});
