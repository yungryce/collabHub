import { Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core'; //importProvidersFrom
import 'zone.js';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarModule, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TaskService } from '../task.service';
import { TaskModel } from '../task';
import Swal from 'sweetalert2';


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
  CalendarView = CalendarView;

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];


  events: CalendarEvent[] = [];

  constructor(private taskService: TaskService) {
    this.fetchTasks();
  }

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

  activeDayIsOpen: boolean = true;

  fetchTasks() {
    this.taskService.getTasks().pipe(
      catchError(error => {
        this.handleResponseError(error);
        return [];
      })
    ).subscribe(tasks => {
      // Convert tasks to calendar events
      this.events = tasks.map(task => {
        return {
          start: task.start ? new Date(task.start) : new Date(),
          end: task.end ? new Date(task.end) : new Date(),
          title: task.title,
          actions: this.actions
        };
      });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  private handleResponseError(error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'An error occurred while fetching tasks'
    });
  }
}
