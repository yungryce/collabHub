import { Component } from '@angular/core';

import { TaskService } from '../task.service';
import { TaskModel, UserData } from '../task';
import { UiUtilsService } from '../ui-utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paused-tasks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './paused-tasks.component.html',
  styleUrl: './paused-tasks.component.css'
})
export class PausedTasksComponent {
  pausedTasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};

  constructor(private taskService: TaskService, private uiUtilsService: UiUtilsService) { }

  ngOnInit(): void {
    this.fetchOngoingTasks();
  }

  fetchOngoingTasks(): void {
    const status = 'PAUSE'; // Adjust this based on your backend endpoint
    this.taskService.getTasksByStatus(status).subscribe(
      (tasks: TaskModel[]) => {
        this.pausedTasks = tasks;

        // Use cached user data
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          const currentUserData: UserData = JSON.parse(cachedUserData);
          this.uiUtilsService.fetchTasksAndUsernames(this.pausedTasks, currentUserData.id);
        }
          
      },
      (error) => {
        console.error('Error fetching ongoing tasks:', error);
        // Handle error as needed
      }
    );
  }

  displayUsernames(task: TaskModel): string {
    const usernames = this.uiUtilsService.getUsernamesForTask(task.id);
    return this.uiUtilsService.displayUsernames(usernames);
  }
}
