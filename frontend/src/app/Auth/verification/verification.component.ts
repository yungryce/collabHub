import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {
  verificationCode: string = '';

  constructor(private authService: AuthService, alertService: AlertService) { }

  submitVerification(): void {
    this.authService.verifyRegistration(this.verificationCode).subscribe();
  }
}