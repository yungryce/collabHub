import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { TaskModel, ResponseInfo, TaskAttachment } from '../collabHub';
import { ErrorService } from '../error.service';
import { AlertService } from '../alert.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private userUrl = `${environment.baseUrl}api/v1/users`;
  private apiUrl = `${environment.baseUrl}api/v1/tasks`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService,
    public errorService: ErrorService,
  ) { }

  getTask(taskId: string): Observable<TaskModel | null> {
    return this.http.get<ResponseInfo>(`${this.apiUrl}/${taskId}`).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(this.errorService.handleError)
    );
  }

  getAllTasks(): Observable<TaskModel[] | null> {
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
        throw new Error('No task Found');
      }),
      catchError(this.errorService.handleError)
    );
  }

  createTask(taskData: TaskModel): Observable<ResponseInfo> {
    console.log(taskData);
    return this.http.post<ResponseInfo>(this.apiUrl, taskData).pipe(
      tap((response: ResponseInfo) => {
        if (response.status === 201 && response.message === 'Successful') {
          this.alertService.showAlert('Task created Successfully.', 'success', 'Success');
        } else {
          console.log('Response::', response);
          throw new HttpErrorResponse({
            error: response.message, // Custom error message
            status: response.status, // Custom status code
          });
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

  saveAttachment(taskId: string, attachmentData: TaskAttachment): Observable<TaskAttachment> {
    return this.http.post<ResponseInfo>(`${this.apiUrl}/${taskId}/attachments`, attachmentData).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 201 && response.message === 'Successful') {
          return response.data;
        }
        throw new Error('Failed to save attachment');
      }),
      catchError(this.errorService.handleError)
    );
  }

  getTaskAttachments(taskId: string): Observable<TaskAttachment[]> {
    return this.http.get<ResponseInfo>(`${this.apiUrl}/${taskId}/attachments`).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(this.errorService.handleError)
    );
  }

  updateAttachment(taskId: string, attachment: TaskAttachment): Observable<TaskAttachment> {
    const url = `${this.apiUrl}/${taskId}/attachments/${attachment.id}`;
    return this.http.put<ResponseInfo>(url, attachment).pipe(
      map((response: ResponseInfo) => {
        if (response.status === 200 && response.data) {
          return response.data;
        }
        throw new Error('Failed to update attachment');
      }),
      catchError(this.errorService.handleError)
    );
  }

  deleteAttachment(taskId: string, attachmentId: string): Observable<ResponseInfo> {
    const url = `${this.apiUrl}/${taskId}/attachments/${attachmentId}`;
    return this.http.delete<ResponseInfo>(url).pipe(
      tap((response) => {
        if (response.status === 200 && response.message === 'Successful') {
          this.alertService.showAlert('Attachment deleted Successfully.', 'success', 'Success');
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
  

  // checkUserExists(userIdentifier: string): Observable<string | null> {
  //   const url = `${this.userUrl}/exists?identifier=${userIdentifier}`;

  //   return this.http.get<ResponseInfo>(url).pipe(
  //     map((response: ResponseInfo) => {
  //       if (response.status === 200 && response.message === 'Successful') {
  //         return response.data; // Return the user ID
  //       }
  //     }),
  //     catchError(this.errorService.handleError)
  //   );
  // }

}

