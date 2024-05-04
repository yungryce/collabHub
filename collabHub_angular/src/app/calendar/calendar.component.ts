import { Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core'; //importProvidersFrom
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import {
  CalendarEvent,
  // CalendarEventTimesChangedEvent,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent,
  CalendarModule,
  CalendarView,
  CalendarEventTimesChangedEvent,
  // DateAdapter,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  // view: string = 'week';
  // snapDraggedEvents = true;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  // dayStartHour = 6;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  events: CalendarEvent[] = [
    {
      title: 'Editable event',
      color: colors.yellow,
      start: new Date(),
      actions: [
        {
          label: '<i class="fas fa-fw fa-pencil-alt"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            console.log('Edit event', event);
          },
        },
      ],
    },
    {
      title: 'Deletable event',
      color: colors.blue,
      start: new Date(),
      actions: [
        {
          label: '<i class="fas fa-fw fa-trash-alt"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.events = this.events.filter((iEvent) => iEvent !== event);
            console.log('Event deleted', event);
          },
        },
      ],
    },
    {
      title: 'A non draggable event',
      color: colors.blue,
      start: new Date(),
    },
  ];


  refresh = new Subject<void>();

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  // public segmentIsValid(date: Date) {
  //   // valid if time is greater than 0800 andd less than 1700
  //   return date.getHours() >= 8 && date.getHours() <= 17;
  // }
  // beforeDayViewRender(day: CalendarDayViewBeforeRenderEvent): void {
  //   // day.body.hourGrid.forEach((hour) => {
  //   //   hour.segments.forEach((segment) => {
  //   //     if (!this.segmentIsValid(segment.date)) {
  //   //       delete segment.cssClass;
  //   //       segment.cssClass = 'cal-disabled';
  //   //     }
  //   //   });
  //   // });
  // }
  // beforeWeekViewRender(body: CalendarWeekViewBeforeRenderEvent): void {
  //   body.hourColumns.forEach((hourCol) => {
  //     hourCol.hours.forEach((hour) => {
  //       hour.segments.forEach((segment) => {
  //         if (!this.segmentIsValid(segment.date)) {
  //           delete segment.cssClass;
  //           segment.cssClass = 'cal-disabled';
  //         }
  //       });
  //     });
  //   });
  // }
}
