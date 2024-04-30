import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiResponse, AuthResponse, LoginData, RegistrationData, UserData } from './user';
import { AlertService } from '../alert.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'authToken';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
  ) { }

  register(userData: RegistrationData): Observable<ApiResponse<null>> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<ApiResponse<null>>(url, userData, this.httpOptions).pipe(
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
    return this.http.post<ApiResponse<AuthResponse>>(url, credentials, this.httpOptions).pipe(
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
    const url = `${this.apiUrl}/logout`;
    const headers = this.getHeaders();
    return this.http.post<ApiResponse<null>>(url, {}, { headers }).pipe(
      tap(response => {
        if (response.status === 200) {
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem('userData');
          this.alertService.successAlert('Logout successful.');
        }
      }),
      catchError(this.handleError)
    );
  }

  getUser(): Observable<ApiResponse<UserData>> {
    const url = `${this.apiUrl}/user`;
    return this.http.get<ApiResponse<UserData>>(url, this.httpOptions).pipe(
      tap(response => {
        if (response.status === 200 && response.data) {
          this.storeUserData(response.data);        }
      }),
      catchError(this.handleError)
    );
  }

  // Add the token to the headers of HTTP requests
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
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
