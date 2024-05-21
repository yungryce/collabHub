import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { TaskModel,UserData } from '../../collabHub';
import { TaskUserUtilsService } from '../task-user-utils.service';

import { TaskService } from '../task.service';
import { AlertService } from '../../alert.service';


@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.css'
})
export class AllTasksComponent {
  tasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};

  constructor(
    private taskService: TaskService,
    private taskUserUtilsService: TaskUserUtilsService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (tasks: TaskModel[] | null) => {
      if (tasks !== null) {
        this.tasks = tasks;
        // Use cached user data
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          const currentUserData: UserData = JSON.parse(cachedUserData);
          this.taskUserUtilsService.fetchTasksAndUsernames(this.tasks, currentUserData.id);
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
    const usernames = this.taskUserUtilsService.getUsernamesForTask(task.id);
    return this.taskUserUtilsService.displayUsernames(usernames);
  }

  editTask(task: TaskModel): void {
    this.taskUserUtilsService.setSelectedTaskId(task.id);
    this.router.navigate(['/tasks/new']);
  }

  deleteTask(taskId: string): void {
    // Show confirmation alert from AlertService
    this.alertService.confirmAlert('Are you sure?', 'warning', 'Are you sure you want to delete this task?')
      .then(result => {
        if (result.isConfirmed) {
          // If confirmed, call the task service to delete the task
          this.taskService.deleteTask(taskId).subscribe(() => {
            // Remove the task from the list of tasks
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            // Show success message
            this.alertService.showAlert('Your task has been deleted.', 'success', 'Deleted!');
          }, error => {
            // Show error message if deletion fails
            console.error('Error deleting task:', error);
            this.alertService.showAlert('Error deleting task', 'error', 'Deletion Failed');
          });
        }
      });
  }
  
}
