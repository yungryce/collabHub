<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        if ($task->users()->where('users.id', $user->id)->exists()) {
            if (($user->role->name === 'manager') && $task->users()->whereHas('role', function ($query) {
                $query->where('name', 'admin');
            })->exists()) {
                return false;
            }
            if (($user->role->name === 'dev') && $task->users()->whereHas('role', function ($query) {
                $query->whereIn('name', ['admin', 'manager']);
            })->exists()) {
                return false;
            }
            if ($user->role->name === 'regular' && $task->users()->whereHas('role', function ($query) {
                $query->whereIn('name', ['admin', 'manager', 'dev']);
            })->exists()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        //
    }
}
