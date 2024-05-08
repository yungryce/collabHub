import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Observable, Subject, of, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { TaskService } from '../task.service';
import { TaskModel, UserData } from '../task';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  tasksLoaded: Subject<TaskModel[]> = new Subject<TaskModel[]>();
  taskUsernamesLoaded: Subject<{ [taskId: string]: string[] }> = new Subject<{ [taskId: string]: string[] }>();

  tasks: TaskModel[] = [];
  taskUsernames: { [taskId: string]: string[] } = {};
  activeLink: string = ''; // Property to hold the active link

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.url; // Update activeLink on navigation end
      }
    });
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
          const usernameObservables: Observable<(string | null)>[] = [];
  
          this.tasks.forEach(task => {
            task.user_ids.forEach(userId => {
                if (userId !== currentUserData.id) {
                    const usernameObservable = this.taskService.getUsername(userId).pipe(
                        tap((username: string | null) => {
                            if (username !== null) {
                                this.taskUsernames[task.id].push(username); // Accessing the class property
                            }
                        }),
                        catchError(error => {
                            console.error(`Error fetching username for user ID ${userId}:`, error);
                            return of(null);
                        })
                    );
                    usernameObservables.push(usernameObservable);
                }
            });
        });
  
          // Emit events for children task components
          this.tasksLoaded.next(this.tasks);
          this.taskUsernamesLoaded.next(this.taskUsernames);
        }
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
  

  isActive(route: string): boolean {
    return this.activeLink === route;
  }
}

