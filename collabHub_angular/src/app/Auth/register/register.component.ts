import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { RegistrationData } from '../user';
import { AuthService } from '../auth.service';
import { AlertService } from '../../alert.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    // FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router
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
    }, { validators: this.passwordMatcher });
  }

  passwordMatcher(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { mismatch: true } : null;
  }

  register(): void {
    if (this.registerForm.invalid || this.registerForm.hasError('mismatch')) {
      this.alertService.errorAlert('Please fill in all fields correctly.');
      return;
    }

    const userData: RegistrationData = this.registerForm.value;

    this.authService.register(userData)
    .subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: error => {
        console.error('Registration error:', error);
      }
    });
  }

}
