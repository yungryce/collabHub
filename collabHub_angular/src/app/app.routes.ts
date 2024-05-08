import { Routes } from '@angular/router';

import { RegisterComponent } from './Auth/register/register.component';
import { LoginComponent } from './Auth/login/login.component';
import { ProfileComponent } from './Auth/profile/profile.component';
import { AllTasksComponent } from './Task/all-tasks/all-tasks.component';
import { NewTasksComponent } from './Task/new-tasks/new-tasks.component';
import { OngoingTasksComponent } from './Task/ongoing-tasks/ongoing-tasks.component';
import { PausedTasksComponent } from './Task/paused-tasks/paused-tasks.component';
import { CompletedTasksComponent } from './Task/completed-tasks/completed-tasks.component';

import { HomeComponent } from './home/home.component';
import { TaskComponent } from './Task/task/task.component';

import { authGuard } from './Auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';


export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Hero' },
    { path: 'register', component: RegisterComponent, title: 'join' },
    { path: 'login', component: LoginComponent, title: 'login' },
    { path: 'profile', component: ProfileComponent, title: 'profile', canActivate: [authGuard],},
    { 
      path: 'tasks',
      component: TaskComponent,
      canActivate: [authGuard],
      children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: AllTasksComponent },
        { path: 'new', component: NewTasksComponent },
        { path: 'ongoing', component: OngoingTasksComponent },
        { path: 'paused', component: PausedTasksComponent },
        { path: 'completed', component: CompletedTasksComponent },
      ]
    },
    { path: 'calendar', component: CalendarComponent, title: 'calendar', canActivate: [authGuard], },
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' }
];