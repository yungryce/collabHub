<?php

namespace Tests\Feature\RoleTest;

use App\Models\Role;
use App\Models\User;


it('allows_admin_to_assign_role', function () {
    // Create an admin user
    $admin = User::factory()->create();
    $admin->role_id = 1;

    // // Check if the 'admin' role already exists
    // $role = Role::where('name', 'admin')->first();
    
    // // If the 'admin' role doesn't exist, create it
    // if (!$role) {
    //     $role = Role::factory()->create(['name' => 'admin']);
    // }

    // // Assign the 'admin' role to the admin user
    // $admin->role_id = $role->id;
    // $admin->save();

    // Authenticate the admin user
    $this->actingAs($admin);

    // Create another user
    $user = User::factory()->create();

    // Simulate assigning the role to the user
    $response = $this->post("/api/user/assign-role", [
        'user_id' => $user->id,
        'role_id' => 2, // Assign the role with ID 1
    ]);

    // Assert that the response status code is 202 (Accepted)
    $response->assertStatus(202);

    // Optionally, assert on the response structure or content
    // For example, you can check for a success message in the JSON response
    $response->assertJson([
        'status' => 'success',
        'message' => 'Role assigned successfully',
    ]);

    // Check if the role was assigned to the user in the database
    $this->assertEquals(2, $user->refresh()->role_id);

});


it('allows_manager_to_assign_role', function () {
    // Create a manager user
    $manager = User::factory()->create();
    $manager->role_id = 2;

    // Authenticate the manager user
    $this->actingAs($manager);

    // Create another user
    $user = User::factory()->create();

    // Simulate assigning the role to the user
    $response = $this->post("/api/user/assign-role", [
        'user_id' => $user->id,
        'role_id' => 3, // Assign the role with ID 3 dev
    ]);

    // Assert that the response status code is 202 (Accepted)
    $response->assertStatus(202);

    // Optionally, assert on the response structure or content
    // For example, you can check for a success message in the JSON response
    $response->assertJson([
        'status' => 'success',
        'message' => 'Role assigned successfully',
    ]);

    // Check if the role was assigned to the user in the database
    $this->assertEquals(3, $user->refresh()->role_id);

});

it('denies_non_privileged_dev_users_from_assigning_role', function () {
    // Create a regular user
    $user = User::factory()->create();
    $user->role_id = 3; // Assuming 'dev' role ID is 3

    // Authenticate the regular user
    $this->actingAs($user);

    // Create another user
    $targetUser = User::factory()->create();

    // Simulate assigning the role to the user
    $response = $this->post("/api/user/assign-role", [
        'user_id' => $targetUser->id,
        'role_id' => 2, // Assign the role with ID 2 manager
    ]);

    // Assert that the response status code is 403 (Forbidden)
    $response->assertStatus(403);
});



it('denies_non_privileged_regular_users_from_assigning_role', function () {
    // Create a regular user
    $user = User::factory()->create();
    $user->role_id = 4; // Assuming 'regular' role ID is 4

    // Authenticate the regular user
    $this->actingAs($user);

    // Create another user
    $targetUser = User::factory()->create();

    // Simulate assigning the role to the user
    $response = $this->post("/api/user/assign-role", [
        'user_id' => $targetUser->id,
        'role_id' => 3, // Assign the role with ID 3 dev
    ]);

    // Assert that the response status code is 403 (Forbidden)
    $response->assertStatus(403);
});