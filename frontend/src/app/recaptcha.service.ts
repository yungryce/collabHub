import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient} from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResponseInfo } from './collabHub';


@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private apiUrl = `${environment.baseUrl}api/v1/recaptcha/verify/`;
  constructor(private http: HttpClient,) { }

  verifyToken(token: string, action: string): Observable<boolean> {
    return this.http.post<ResponseInfo>(this.apiUrl, { token, action }).pipe(
      map((response: ResponseInfo) => response.status === 200 && response.data.score > 0.5)
    );
  }
}
