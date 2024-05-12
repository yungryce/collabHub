import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TaskModel,UserData } from '../../collabHub';
import { UiUtilsService } from '../ui-utils.service';

import { TaskService } from '../task.service';
import { AlertService } from '../../alert.service';


@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.css'
})
export class AllTasksComponent {
  tasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};

  constructor(
    private taskService: TaskService,
    private uiUtilsService: UiUtilsService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks: TaskModel[] | null) => {
      if (tasks !== null) {
        this.tasks = tasks;

        // Use cached user data
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          const currentUserData: UserData = JSON.parse(cachedUserData);
          this.uiUtilsService.fetchTasksAndUsernames(this.tasks, currentUserData.id);
        }
      } else {
        // Handle case where tasks is null
        console.error('No tasks found.');
        this.alertService.showAlert('You currently have no tasks.', 'info', 'Start creating tasks');
        this.router.navigate(['/tasks/new']);
      }
    },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
    
  displayUsernames(task: TaskModel): string {
    const usernames = this.uiUtilsService.getUsernamesForTask(task.id);
    return this.uiUtilsService.displayUsernames(usernames);
  }

  editTask(task: TaskModel): void {
    // Call method from TaskService to update task
    this.taskService.updateTask(task).subscribe(
      (updatedTask: TaskModel) => {
        // Handle success response
        console.log('Task updated successfully:', updatedTask);
      },
      (error) => {
        // Handle error response
        console.error('Error updating task:', error);
      }
    );
  }

  deleteTask(taskId: string): void {
    // Show alert from AlertService
    this.alertService.showAlert('You currently have no tasks.', 'info', 'Start creating tasks')
      .then(() => {
        // Show confirmation alert from AlertService
        return this.alertService.confirmAlert('Are you sure?', 'warning', 'Are you sure you want to delete this task?');
      })
      .then((result) => {
        if (result.isConfirmed) {
          // If confirmed, call the task service to delete the task
          this.taskService.deleteTask(taskId).subscribe(() => {
            // Remove the task from the list of tasks
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            // Show success message
            this.alertService.showAlert('Your task has been deleted.', 'success', 'Deleted!');
          });
        }
      });
  }
  
}
