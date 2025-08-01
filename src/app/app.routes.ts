import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CitizenDashboardComponent } from './pages/citizen-dashboard/citizen-dashboard.component';
import { celebrantGuard, citizenGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservation', component: ReservationComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [celebrantGuard]
  },
  { 
    path: 'citizen-dashboard', 
    component: CitizenDashboardComponent,
    canActivate: [citizenGuard]
  },
  { path: '**', redirectTo: '/' }
];
