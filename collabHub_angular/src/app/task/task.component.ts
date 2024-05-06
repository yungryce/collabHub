import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { TaskModel } from '../task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  tasks: TaskModel[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
  }
}
