import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';


@Injectable({
  providedIn: 'root'
})
export class DateTimeUtilsService {

  constructor() { }

  getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  formatDateTime(dateTime: Date | string): string {
    const date = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  formatDateForInput(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }
}

