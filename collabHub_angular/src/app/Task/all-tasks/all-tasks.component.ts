import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskModel,UserData } from '../task';
import { UiUtilsService } from '../ui-utils.service';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../task.service';



@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.css'
})
export class AllTasksComponent {
  tasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};

  constructor(private taskService: TaskService, private uiUtilsService: UiUtilsService) { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks: TaskModel[]) => {
        this.tasks = tasks;
  
        // Use cached user data
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          const currentUserData: UserData = JSON.parse(cachedUserData);
          this.uiUtilsService.fetchTasksAndUsernames(this.tasks, currentUserData.id);
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

}
