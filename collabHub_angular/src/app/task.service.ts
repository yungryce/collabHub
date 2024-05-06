import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { TaskModel, ResponseInfo } from './task';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/v1/tasks';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // getTasks(): Observable<TaskModel[]> {
  //   return this.http.get<ResponseInfo>(this.apiUrl);
  // }

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<ResponseInfo>(this.apiUrl, this.httpOptions).pipe(
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
