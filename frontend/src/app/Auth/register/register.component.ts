import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module } from 'ng-recaptcha';
// import { ReCaptchaV3Service } from 'ng-recaptcha';

import { RegistrationData } from '../../collabHub';
import { AuthService } from '../auth.service';
import { AlertService } from '../../alert.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  loading = false;
  recaptchaResponse: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    // private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      recaptcha: ['', Validators.required]
    }, { validators: this.passwordMatcher });
  }

  passwordMatcher(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { mismatch: true } : null;
  }

  handleRecaptcha(captchaResponse: string | null): void {
    this.recaptchaResponse = captchaResponse;
    this.registerForm.get('recaptcha')?.setValue(captchaResponse || ''); // Set empty string if captchaResponse is null
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const userData: RegistrationData = this.registerForm.value;
    this.loading = true;

    this.authService.register(userData)
    .subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/verification']);
      },
      error: error => {
        console.error('Registration error:', error);
        this.loading = false;
      }
    });
  }

}
