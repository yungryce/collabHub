<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(2)->create([
            'role_id' => 1, // Assuming 'admin' role has ID 1
        ]);
        
        // Create 20 tasks with multiple users
        Task::factory(20)->create()->each(function ($task) {
            // Get a random admin user
            $user = User::where('role_id', 1)->inRandomOrder()->first();
        
            // Attach the admin user to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($user);
        
            // Get a random number of additional users for the task (up to 5)
            $additionalUsers = User::where('role_id', '!=', 1)->inRandomOrder()->limit(rand(0, 5))->get();
        
            // Attach the additional users to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($additionalUsers);

        });
        


        User::factory(10)->create([
            'role_id' => 2, // Assuming 'manager' role has ID 2
        ]);
        // Create 20 tasks with multiple users
        Task::factory(20)->create()->each(function ($task) {
            // Get a random admin user
            $user = User::where('role_id', 2)->inRandomOrder()->first();
        
            // Attach the admin user to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($user);
        
            // Get a random number of additional users for the task (up to 5)
            $additionalUsers = User::inRandomOrder()->limit(rand(0, 5))->get();
        
            // Attach the additional users to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($additionalUsers);

        });


        User::factory(25)->create([
            'role_id' => 3, // Assuming 'dev' role has ID 3
        ]);
        // Create 20 tasks with multiple users
        Task::factory(60)->create()->each(function ($task) {
            // Get a random admin user
            $user = User::where('role_id', 3)->inRandomOrder()->first();
        
            // Attach the admin user to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($user);
        
            // Get a random number of additional users for the task (up to 5)
            $additionalUsers = User::inRandomOrder()->limit(rand(0, 5))->get();
        
            // Attach the additional users to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($additionalUsers);

        });



        User::factory(163)->create([
            'role_id' => 4, // Assuming 'regular' role has ID 4
        ]);

        // Create 20 tasks with multiple users
        Task::factory(300)->create()->each(function ($task) {
            // Get a random admin user
            $user = User::where('role_id', 4)->inRandomOrder()->first();
        
            // Attach the admin user to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($user);
        
            // Get a random number of additional users for the task (up to 5)
            $additionalUsers = User::inRandomOrder()->limit(rand(0, 5))->get();
        
            // Attach the additional users to the task (without detaching existing users)
            $task->users()->syncWithoutDetaching($additionalUsers);

        });
    }
}
