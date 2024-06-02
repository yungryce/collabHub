import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { UserData, ApiResponse } from '../../collabHub';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userData: UserData | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Check if user data exists in localStorage
    const cachedUserData = localStorage.getItem('userData');
    if (cachedUserData) {
      // Use cached user data
      this.userData = JSON.parse(cachedUserData);
    } else {
      // Fetch user data from the server
      this.authService.getActiveUser()
      .subscribe();
    }
  }

}
