import { Injectable } from '@angular/core';

import { TaskService } from './task.service';
import { TaskModel } from './task';


@Injectable({
  providedIn: 'root'
})
export class UiUtilsService {
  // Define a property to store usernames for each task
  private taskUsernamesMap: { [taskId: string]: string[] } = {};

  constructor(private taskService: TaskService) { }

  fetchTasksAndUsernames(tasks: TaskModel[], currentUserId: string): void {
    // Clear the taskUsernamesMap before populating it with new usernames
    this.taskUsernamesMap = {};

    tasks.forEach(task => {
      // Clear the array for each task before populating it with new usernames
      this.taskUsernamesMap[task.id] = [];

      task.user_ids.forEach(userId => {
        if (currentUserId) {
          this.taskService.getUsername(userId).subscribe(
            (username: string | null) => {
              if (username !== null) {
                // Store usernames in the map
                this.taskUsernamesMap[task.id].push(username);
              }
            },
            (error) => {
              console.error(`Error fetching username for user ID ${userId}:`, error);
            }
          );
        }
      });
    });
  }

  // Method to retrieve usernames for a specific task
  getUsernamesForTask(taskId: string): string[] {
    return this.taskUsernamesMap[taskId] || [];
  }

  // Method to display usernames
  displayUsernames(usernames: string[] | undefined): string {
    if (!usernames || usernames.length === 0) {
      return '-';
    } else {
      const firstUsername = usernames[0];
      const remainingCount = usernames.length - 1;
      if (remainingCount === 0) {
        return firstUsername;
      } else {
        return `${firstUsername} & ${remainingCount} others`;
      }
    }
  }
}
