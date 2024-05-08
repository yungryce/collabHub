import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { TaskModel, ResponseInfo, UserData } from './task';
import { AuthService } from '../Auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/v1/tasks';
  private userUrl = 'http://localhost:5000/api/v1/users';

  constructor(private authService: AuthService, private http: HttpClient) { }

  getTasks(): Observable<TaskModel[]> {

    return this.http.get<ResponseInfo>(this.apiUrl).pipe(
      map((response: ResponseInfo) => {
        if (response.data && Array.isArray(response.data)) {
          // Tasks found, return the data
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

  getUsername(userId: string): Observable<string> {
    const url = `${this.userUrl}/${userId}/username`;
  
    return this.http.get<ResponseInfo>(url).pipe(
      map((response: ResponseInfo) => {
        if (response.data && typeof response.data === 'string') {
          return response.data;
        } else {
          throw new Error('Invalid response format');
        }
      }),
      catchError((error) => {
        this.handleResponseError(error);
        return throwError(error);
      })
    );
  }

  private handleResponseError(error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error occurred while fetching tasks'
    });
  }
}

