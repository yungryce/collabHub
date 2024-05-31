import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ReCaptchaV3Service, RecaptchaV3Module, } from 'ng-recaptcha';

import { AuthService } from '../auth.service';
import { AlertService } from '../../alert.service';
import { CommonModule } from '@angular/common';
import { RecaptchaService } from '../../recaptcha.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    FormsModule,
    RecaptchaV3Module,
    CommonModule,
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {
  verificationCode: string = '';
  loading = false;
  recaptchaSubscription: Subscription | null = null;
  recaptchaToken: string | null = null;
  recaptchaValid = false;

  constructor(
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recaptchaService: RecaptchaService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.executeRecaptcha();
  }

  executeRecaptcha(): void {
    this.loading = true;
    this.recaptchaSubscription = this.recaptchaV3Service.execute('register').pipe(
      switchMap(token => this.recaptchaService.verifyToken(token, 'register'))
    ).subscribe({
      next: (isValid: boolean) => {
        this.recaptchaValid = isValid;
        if (!isValid) {
          this.alertService.showAlert('reCAPTCHA verification failed. Please reload the page and try again.', 'error', 'Error');
        }
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showAlert('reCAPTCHA verification failed. Please reload the page and try again.', 'error', 'Error');
        this.loading = false;
      }
    });
  }

  submitVerification(): void {
    this.authService.verifyRegistration(this.verificationCode).subscribe();
  }

  ngOnDestroy(): void {
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }
}