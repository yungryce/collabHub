import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { ApiResponse, AuthResponse, LoginData, RegistrationData, UserData } from './user';
import { AlertService } from '../alert.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userUrl = 'http://localhost:5000/api/v1/users';
  private tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router 
  ) { }

  register(userData: RegistrationData): Observable<ApiResponse<null>> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<ApiResponse<null>>(url, userData).pipe(
      tap(response => {
        if (response.status === 201) {
          this.alertService.successAlert('Registration successful.');
        }
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: LoginData): Observable<ApiResponse<AuthResponse>> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<ApiResponse<AuthResponse>>(url, credentials).pipe(
      tap(response => {
        if (response.status === 200 && response.data) {
          this.storeToken(response.data.token);
          this.storeUserData(response.data.user); // Store user data to local storage
          this.alertService.successAlert('Login successful.');
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<ApiResponse<null>> {
    if (!this.isLoggedIn()) {
      // Token is not present, no need to logout
      return of({ status: 200, message: 'Already logged out' });
    }

    const url = `${this.apiUrl}/logout`;
    return this.http.post<ApiResponse<null>>(url, {}).pipe(
      tap(response => {
        if (response.status === 200) {
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem('userData');
          this.alertService.successAlert('Logout successful.');
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          // Token expired, so logout the user
          this.logoutUser();
        }
        return this.handleError(error);
      })
    );
  }

  // rename to signify active user
  getUser(): Observable<ApiResponse<UserData>> {
    return this.http.get<ApiResponse<UserData>>(this.userUrl).pipe(
      tap(response => {
        if (response.status === 200 && response.data) {
          this.storeUserData(response.data);        }
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private storeUserData(user: UserData): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    return of(!!token); // Return Observable of boolean indicating authentication status
  }

  logoutUser(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']); // Redirect to login page
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    this.alertService.errorAlert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
