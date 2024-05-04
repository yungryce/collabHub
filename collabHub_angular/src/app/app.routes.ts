import { Routes } from '@angular/router';

import { RegisterComponent } from './Auth/register/register.component';
import { LoginComponent } from './Auth/login/login.component';
import { ProfileComponent } from './Auth/profile/profile.component';

import { HomeComponent } from './home/home.component';
import { TaskComponent } from './task/task.component';

import { authGuard } from './Auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';


export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Hero' },
    { path: 'register', component: RegisterComponent, title: 'join' },
    { path: 'login', component: LoginComponent, title: 'login' },
    { path: 'profile', component: ProfileComponent, title: 'profile', canActivate: [authGuard],},
    { path: 'tasks', component: TaskComponent, title: 'tasks', canActivate: [authGuard],},
    { path: 'calendar', component: CalendarComponent, title: 'calendar', },
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' }
];