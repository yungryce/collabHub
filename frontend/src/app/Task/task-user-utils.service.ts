import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../Auth/auth.service';
import { TaskModel } from '../collabHub';


@Injectable({
  providedIn: 'root'
})
export class TaskUserUtilsService {
  // Define a property to store usernames for each task
  private taskUsernamesMap: { [taskId: string]: string[] } = {};
  private selectedTaskIdSource = new BehaviorSubject<string | null>(null);
  selectedTaskId$ = this.selectedTaskIdSource.asObservable();

  constructor(private authService: AuthService) { }

  setSelectedTaskId(taskId: string): void {
    this.selectedTaskIdSource.next(taskId);
  }

  fetchTasksAndUsernames(tasks: TaskModel[], currentUserId: string): void {
    // Clear the taskUsernamesMap before populating it with new usernames
    this.taskUsernamesMap = {};

    tasks.forEach(task => {
      // Clear the array for each task before populating it with new usernames
      this.taskUsernamesMap[task.id] = [];

      task.user_ids.forEach(userId => {
        if (currentUserId) {
          this.authService.getUsername(userId).subscribe(
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
