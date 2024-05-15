import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../Auth/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit() {
    this.authService.isLoggedInObservable()
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
  }

  logout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.authService.logout()
      .subscribe({
        next: () => {
          this.isLoggedIn = false;
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Registration error:', error);
        }
      });
  }

}
