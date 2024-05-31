import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ReCaptchaV3Service, RecaptchaV3Module, } from 'ng-recaptcha';

import { LoginData } from '../../collabHub';
import { AuthService } from '../auth.service';
import { AlertService } from '../../alert.service';
import { RecaptchaService } from '../../recaptcha.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  recaptchaSubscription: Subscription | null = null;
  recaptchaToken: string | null = null;
  recaptchaValid = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recaptchaService: RecaptchaService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.executeRecaptcha();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
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

  login(): void {
    const credentials: LoginData = this.loginForm.value;

    this.authService.login(credentials)
    .subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: error => {
        console.error('Login error:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }
}
