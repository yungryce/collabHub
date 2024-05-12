import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Observable, Subject, of, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { TaskService } from '../task.service';
import { TaskModel, UserData } from '../../collabHub';
import { AllTasksComponent } from '../all-tasks/all-tasks.component';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AllTasksComponent
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  activeLink: string = ''; // Property to hold the active link

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.url; // Update activeLink on navigation end
      }
    });
  }

  isActive(route: string): boolean {
    return this.activeLink === route;
  }
}

