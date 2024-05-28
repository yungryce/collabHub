import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  showAlert(text: string, icon: SweetAlertIcon, title: string): Promise<any> {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'OK'
    });
  }


  // Method to display a confirmation alert
  confirmAlert(text: string, icon: SweetAlertIcon, title: string): Promise<any> {
    return Swal.fire({
      icon,
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
  }

}
