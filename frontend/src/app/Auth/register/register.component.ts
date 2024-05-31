import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReCaptchaV3Service, RecaptchaV3Module, } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RegistrationData } from '../../collabHub';
import { AuthService } from '../auth.service';
import { AlertService } from '../../alert.service';
import { RecaptchaService } from '../../recaptcha.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RecaptchaV3Module
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
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
    private recaptchaService: RecaptchaService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.executeRecaptcha();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    }, { validators: this.passwordMatcher });
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


  register(): void {
    if (this.registerForm.invalid || !this.recaptchaValid) {
      return;
    }

    this.loading = true;
    const userData: RegistrationData = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/verification']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.loading = false;
        this.router.navigate(['/register']);
      }
    });
  }

  passwordMatcher(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { mismatch: true } : null;
  }

  ngOnDestroy(): void {
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }
}
