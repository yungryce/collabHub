import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import {
  // CalendarEvent,
  // CalendarEventTimesChangedEvent,
  // CalendarWeekViewBeforeRenderEvent,
  // CalendarDayViewBeforeRenderEvent,
  CalendarModule,
  DateAdapter,
} from 'angular-calendar';
// import { Subject } from 'rxjs';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ]
};
