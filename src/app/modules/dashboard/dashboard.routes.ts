import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

import { ScanComponent } from './components/scan/scan.component';
import { ItemComponent } from './components/item/item.component';
import { LogComponent } from './components/log/log.component';
import { UserComponent } from './components/user/user.component';
import { CategoryComponent } from './components/category/category.component';
import { StatusComponent } from './components/status/status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';
import { dashboardResolver } from './dashboard.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [authGuard],
    resolve: [dashboardResolver],
    children: [
      { path: '', redirectTo: 'scan', pathMatch: 'full' },
      { path: 'scan', component: ScanComponent },
      { path: 'item', component: ItemComponent },
      { path: 'log', component: LogComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'password', component: PasswordComponent },
      {
        path: 'setting',
        canActivateChild: [adminGuard],
        children: [
          { path: '', redirectTo: 'user', pathMatch: 'full' },
          { path: 'user', component: UserComponent },
          { path: 'category', component: CategoryComponent },
          { path: 'status', component: StatusComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
