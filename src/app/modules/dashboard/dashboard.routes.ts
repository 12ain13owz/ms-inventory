import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ScanComponent } from './components/scan/scan.component';
import { ItemComponent } from './components/item/item.component';
import { LogComponent } from './components/log/log.component';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './components/user/user.component';
import { CategoryComponent } from './components/category/category.component';
import { StatusComponent } from './components/status/status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { profileResolver } from './resolver/profile.resolver';
import { PasswordComponent } from './components/password/password.component';
import { categoryResolver } from './resolver/category.resolver';
import { statusResolver } from './resolver/status.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: [profileResolver],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'scan', pathMatch: 'full' },
      { path: 'scan', component: ScanComponent },
      { path: 'item', component: ItemComponent },
      { path: 'log', component: LogComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'password', component: PasswordComponent },
      {
        path: 'setting',
        canActivateChild: [],
        children: [
          { path: 'user', component: UserComponent },
          {
            path: 'category',
            component: CategoryComponent,
            resolve: [categoryResolver],
          },
          {
            path: 'status',
            component: StatusComponent,
            resolve: [statusResolver],
          },
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
