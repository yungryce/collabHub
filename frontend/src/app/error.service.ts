import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private alertService: AlertService) { }

  public handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    let errorTitle = 'Error';

    if (error instanceof HttpErrorResponse) {
      // A server-side error occurred
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.error && typeof error.error === 'object') {
        // The backend returned an error message.
        errorMessage = error.error.error || 'Error';
        errorTitle = error.error.message || 'Error';
      }
    } else if (error && typeof error === 'object') {
      // Handle thrown error objects
      errorMessage = error.error || 'Error';
      errorTitle = error.message || 'Error';
    } else if (typeof error === 'string') {
      // Handle thrown error strings
      errorMessage = error;
    }

    console.error(errorMessage, errorTitle);
    if (this.alertService) {
      this.alertService.showAlert('errorMessage', 'error', 'Error');
      this.alertService.showAlert(errorMessage, 'error', errorTitle);
    } else {
      console.error('AlertService is not defined!');
    }
    return throwError(() => new Error(errorMessage));
  }
}
