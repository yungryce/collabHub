import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TaskService } from '../task.service';
import { TaskModel, UserData } from '../../collabHub';
import { UiUtilsService } from '../ui-utils.service';
import { AlertService } from '../../alert.service';


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

  constructor(
    private taskService: TaskService,
    private uiUtilsService: UiUtilsService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchOngoingTasks();
  }

  fetchOngoingTasks(): void {
    const status = 'PAUSE'; // Adjust this based on your backend endpoint
    this.taskService.getTasksByStatus(status).subscribe(
      (tasks: TaskModel[] | null) => {
        if (tasks !== null) {
          this.pausedTasks = tasks;
  
          // Use cached user data
          const cachedUserData = localStorage.getItem('userData');
          if (cachedUserData) {
            const currentUserData: UserData = JSON.parse(cachedUserData);
            this.uiUtilsService.fetchTasksAndUsernames(this.pausedTasks, currentUserData.id);
          }
        } else {
          // Handle case where tasks is null
          console.error('No Paused tasks.');
          this.alertService.showAlert('You currently have no tasks.', 'info', 'Start creating tasks');
          this.router.navigate(['/tasks/new']);
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
