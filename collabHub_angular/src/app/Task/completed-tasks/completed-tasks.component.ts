import { Component } from '@angular/core';

import { TaskService } from '../task.service';
import { TaskModel, UserData } from '../task';
import { UiUtilsService } from '../ui-utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.css'
})
export class CompletedTasksComponent {
  completedTasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};

  constructor(private taskService: TaskService, private uiUtilsService: UiUtilsService) { }

  ngOnInit(): void {
    this.fetchOngoingTasks();
  }

  fetchOngoingTasks(): void {
    const status = 'DONE'; // Adjust this based on your backend endpoint
    this.taskService.getTasksByStatus(status).subscribe(
      (tasks: TaskModel[]) => {
        this.completedTasks = tasks;

        // Use cached user data
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          const currentUserData: UserData = JSON.parse(cachedUserData);
          this.uiUtilsService.fetchTasksAndUsernames(this.completedTasks, currentUserData.id);
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
