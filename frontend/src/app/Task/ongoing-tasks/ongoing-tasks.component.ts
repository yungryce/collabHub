import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TaskService } from '../task.service';
import { TaskModel, UserData } from '../../collabHub';
import { TaskUserUtilsService } from '../task-user-utils.service';
import { AlertService } from '../../alert.service';


@Component({
  selector: 'app-ongoing-tasks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ongoing-tasks.component.html',
  styleUrl: './ongoing-tasks.component.css'
})
export class OngoingTasksComponent {
  ongoingTasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};

  constructor(
    private taskService: TaskService,
    private taskUserUtilsService: TaskUserUtilsService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchOngoingTasks();
  }

  fetchOngoingTasks(): void {
    const status = 'IN_PROGRESS'; // Adjust this based on your backend endpoint
    this.taskService.getTasksByStatus(status).subscribe(
      (tasks: TaskModel[] | null) => {
        if (tasks !== null) {
          this.ongoingTasks = tasks;
  
          // Use cached user data
          const cachedUserData = localStorage.getItem('userData');
          if (cachedUserData) {
            const currentUserData: UserData = JSON.parse(cachedUserData);
            this.taskUserUtilsService.fetchTasksAndUsernames(this.ongoingTasks, currentUserData.id);
          }
        } else {
          // Handle case where tasks is null
          console.error('No tasks Ongoing.');
          this.alertService.showAlert('You currently have no Ongoing tasks.', 'info', 'Start creating tasks');
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
    const usernames = this.taskUserUtilsService.getUsernamesForTask(task.id);
    return this.taskUserUtilsService.displayUsernames(usernames);
  }

}
