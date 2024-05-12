import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { TaskModel, ResponseInfo } from '../collabHub';
import { ErrorService } from '../error.service';
import { AlertService } from '../alert.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/v1/tasks';
  private userUrl = 'http://localhost:5000/api/v1/users';

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    public errorService: ErrorService,
  ) { }

  getTasks(): Observable<TaskModel[] | null> {
    return this.http.get<ResponseInfo>(this.apiUrl).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data && Array.isArray(response.data)) {
          // Tasks found, return the data
          return response.data;
        } else {
          this.router.navigate(['/create-task']);
          return null;
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  getTasksByStatus(status: string): Observable<TaskModel[] | null> {
    const url = `${this.apiUrl}/status/${status}`;
    return this.http.get<ResponseInfo>(url).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data && Array.isArray(response.data)) {
          // Tasks found, return the data
          return response.data;
        }
        return null;
      }),
      catchError(this.errorService.handleError)
    );
  }

  createTask(taskData: TaskModel): Observable<ResponseInfo> {
    return this.http.post<ResponseInfo>(this.apiUrl, taskData).pipe(
      tap((response: ResponseInfo) => {
        if (response.status === 201 && response.message === 'Successful') {
          this.alertService.showAlert('Task created Successfully.', 'success', 'Success');
        }
      }),
      catchError(this.errorService.handleError)
    );
  }
  

  updateTask(task: TaskModel): Observable<TaskModel> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put<ResponseInfo>(url, task).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data) {
          return response.data;
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

  deleteTask(taskId: string): Observable<ResponseInfo> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<ResponseInfo>(url).pipe(
      tap((response) => {
        if (response.status === 200 && response.message === 'Successful') {
          this.alertService.showAlert('Task deleted Successfully.', 'success', 'Success');
        }
      }),
      catchError(this.errorService.handleError)
    );
  }


  getUsername(userId: string): Observable<string> {
    const url = `${this.userUrl}/${userId}/username`;
  
    return this.http.get<ResponseInfo>(url).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data && typeof response.data === 'string') {
          return response.data;
        }
        // Return a default value when the conditions are not met
        return ''; // or return null;
      }),
      catchError(this.errorService.handleError)
    );
  }
  

  checkUserExists(userIdentifier: string): Observable<string | null> {
    const url = `${this.userUrl}/exists?identifier=${userIdentifier}`;

    return this.http.get<ResponseInfo>(url).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.message === 'Successful') {
          return response.data; // Return the user ID
        }
      }),
      catchError(this.errorService.handleError)
    );
  }

}

