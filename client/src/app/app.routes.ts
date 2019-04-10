import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RideListComponent} from "./rides/ride-list.component";
import {UserProfileComponent} from "./users/user-profile.component";
import {AuthGuardService} from "./auth/auth-guard.service";

// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rides', component: RideListComponent, canActivate: [AuthGuardService]},
  {path: 'users', component: UserProfileComponent, canActivate: [AuthGuardService]}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
