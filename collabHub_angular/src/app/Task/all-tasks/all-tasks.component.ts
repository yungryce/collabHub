import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskModel } from '../task';
import { UiUtilsService } from '../ui-utils.service';
import { TaskComponent } from '../task/task.component';



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
  private unsubscribe$ = new Subject<void>(); 

  constructor(private taskComponent: TaskComponent, private uiUtilsService: UiUtilsService) { }


  ngOnInit(): void {
    this.taskComponent.tasksLoaded.pipe(takeUntil(this.unsubscribe$)).subscribe(tasks => {
      this.tasks = tasks;
      console.log('Tasks:', this.tasks);
    });

    this.taskComponent.taskUsernamesLoaded.pipe(takeUntil(this.unsubscribe$)).subscribe(taskUsernames => {
      this.taskUsernames = taskUsernames;
      console.log('Task Usernames:', this.taskUsernames);
    });
  }

  displayUsernames(usernames: string[] | undefined): string {
    console.log(`usernames:`, this.uiUtilsService.displayUsernames(usernames));
    return this.uiUtilsService.displayUsernames(usernames);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Complete the unsubscribe$ subject
    this.unsubscribe$.complete();
  }
}
