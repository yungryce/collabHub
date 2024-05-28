import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaSettings } from 'ng-recaptcha';
import 'zone.js';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { errorInterceptor, headerInterceptor } from './Auth/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.siteKeyV3 },
    {
      provide: RECAPTCHA_SETTINGS,cc
      useValue: {
        siteKey: environment.siteKeyV2,
      } as RecaptchaSettings,
    },
    provideHttpClient(
      withInterceptors([errorInterceptor, headerInterceptor])
    ),
    importProvidersFrom(
      HttpClientModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ]
};
