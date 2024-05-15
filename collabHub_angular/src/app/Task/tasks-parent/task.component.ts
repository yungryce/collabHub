import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';


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
export class TasksParentComponent {
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

