import { Injectable } from '@angular/core';
// import { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import Swal from 'sweetalert2';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // showAlert(title: string, text: string, icon: SweetAlertIcon = 'info'): void {
  //   Swal.fire({
  //     title,
  //     text,
  //     icon
  //   });
  // }

  // showConfirmation(title: string, text: string): Promise<SweetAlertResult> {
  //   return Swal.fire({
  //     title,
  //     text,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   });
  // }

  // Method to display a success alert
  successAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message
    });
  }

  // Method to display an error alert
  errorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message
    });
  }

  // Method to display a confirmation alert
  confirmAlert(message: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
  }

  constructor() { }
}
