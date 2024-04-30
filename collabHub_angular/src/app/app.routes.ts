import { Routes } from '@angular/router';
import { RegisterComponent } from './Auth/register/register.component';
import { LoginComponent } from './Auth/login/login.component';
import { ProfileComponent } from './Auth/profile/profile.component';
import { authGuard } from './Auth/auth.guard';


export const routes: Routes = [
    { path: 'register', component: RegisterComponent , title: 'join' },
    { path: 'login', component: LoginComponent, title: 'login' },
    { path: 'profile', component: ProfileComponent, title: 'profile', canActivate: [authGuard],},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' }
];