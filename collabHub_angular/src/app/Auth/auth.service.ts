import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { ApiResponse, AuthResponse, LoginData, RegistrationData, UserData, ResponseInfo } from '../collabHub';
import { AlertService } from '../alert.service';
import { ErrorService } from '../error.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userUrl = 'http://localhost:5000/api/v1/users';
  private tokenKey = 'authToken';

  // private authenticationStatusSubject = new Subject<boolean>();
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    public errorService: ErrorService
  ) { 
      // Check authentication status on initialization
      this.isLoggedInSubject.next(this.isLoggedIn());
   }

  checkUserExists(userIdentifier: string): Observable<string | null> {
    const url = `${this.userUrl}/exists?identifier=${userIdentifier}`;
  
    return this.http.get<ResponseInfo>(url).pipe(
      map((response: ResponseInfo) => {
        console.log('User exists:', response);
        if (response.status === 200 && response.message === 'Successful' && response.data) {
          return response.data; // Return the user ID
        } else if (response.status === 404 && response.message === 'Not Found') {
          throwError('User not found');
        }
        return null;
      }),
      catchError(this.errorService.handleError)

    );
  }
  

  // rename to signify active user
  getUser(): Observable<ResponseInfo> {
    return this.http.get<ApiResponse<UserData>>(this.userUrl).pipe(
      tap(response => {
        if (response.status === 200 && response.data) {
          this.storeUserData(response.data);
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  register(userData: RegistrationData): Observable<ResponseInfo> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<ResponseInfo>(url, userData).pipe(
      tap(response => {
        if (response.status === 201 && response.message === 'Successful') {
          console.log('Registration successful:', response);
          this.alertService.showAlert('Registration successful.', 'success', 'Success');
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  login(credentials: LoginData): Observable<ResponseInfo> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<ApiResponse<AuthResponse>>(url, credentials).pipe(
      tap(response => {
        if (response.status === 200 && response.data) {
          console.log(response.status, response.message);
          this.storeToken(response.data.token);
          this.storeUserData(response.data.user); // Store user data to local storage
          // this.authenticationStatusSubject.next(true);
          this.isLoggedInSubject.next(true);
          this.alertService.showAlert('Login successful.', 'success', 'Success');
        }
        else {
          this.alertService.showAlert('Invalid Username or Password.', 'error', 'Error');
        }
      }),
      
      catchError(this.errorService.handleError)
    );
  }

  logout(): Observable<ResponseInfo> {
    if (!this.isLoggedIn()) {
      this.alertService.showAlert('Please log in to perform this action.', 'info', 'Please Log In')
        .then(() => {
          // Redirect the user to the login page
          this.router.navigate(['/login']);
        });
      // Return an empty observable since the user is not logged in
      return of({ status: 200, message: 'Already logged out' });
    }
  
    const url = `${this.apiUrl}/logout`;
    return this.http.post<ResponseInfo>(url, {}).pipe(
      tap(response => {
        if (response.status === 200 && response.message === 'Successful') {
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem('userData');
          this.isLoggedInSubject.next(false);
          this.alertService.showAlert('Logout successful.', 'success', 'Success');
        }
      }),

      catchError(this.errorService.handleError)
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

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Return boolean indicating authentication status
  }

  isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable(); // Return observable of boolean indicating authentication status
  }

  logoutUser(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']); // Redirect to login page
  }
  
}
