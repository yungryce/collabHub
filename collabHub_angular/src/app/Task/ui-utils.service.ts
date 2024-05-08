import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiUtilsService {

  constructor() { }

  displayUsernames(usernames: string[] | undefined): string {
    if (!usernames || usernames.length === 0) {
      return '-';
    } else {
      const firstUsername = usernames[0];
      const remainingCount = usernames.length - 1;
      if (remainingCount === 0) {
        return firstUsername;
      } else {
        return `${firstUsername} & ${remainingCount} others`;
      }
    }
  }
}
