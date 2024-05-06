import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { TaskModel, ResponseInfo } from './task';
import { AuthService } from './Auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/v1/tasks';

  constructor(private authService: AuthService, private http: HttpClient) { }

  getTasks(): Observable<TaskModel[]> {
    const token = this.authService.getToken();
    if (!token) {
      // No token found, throw an error
      return throwError(new Error('Authentication token not found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ResponseInfo>(this.apiUrl, { headers }).pipe(
      map((response: ResponseInfo) => {
        if (response.data && Array.isArray(response.data)) {
          // Tasks found, return the data
          console.log(response.data);
          return response.data;
        } else {
          // No tasks found or invalid response, throw an error
          throw new Error('Invalid response format');
        }
      }),
      catchError((error) => {
        // Handle the error and display alert
        this.handleResponseError(error);
        // Rethrow the error to propagate it downstream
        return throwError(error);
      })
    );
  }

  private handleResponseStatus(status: number, message?: string): void {
    let alertMessage = 'An error occurred';
    if (message) {
      alertMessage += `: ${message}`;
    }
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: alertMessage
    });
  }

  private handleResponseError(error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error occurred while fetching tasks'
    });
  }
}
