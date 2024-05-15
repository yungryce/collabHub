import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeUtilsService {

  constructor() { }

  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
  }
}
