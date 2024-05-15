import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private alertService: AlertService) { }

  public handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    let errorTitle = 'Error';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Error: ${error.error.message}`;
    }  else if (error.error && error.error.error) {
      // The backend returned an error message.
      errorMessage = error.error.error || 'Error';
      errorTitle = error.error.message;
    }
    console.error(errorMessage);
    this.alertService.showAlert(errorMessage, 'error', errorTitle);
    return throwError(() => new Error(errorMessage));
  }
}
