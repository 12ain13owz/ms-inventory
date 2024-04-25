import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardGuard } from './guards/dashboard.guard';
import { adminGuard } from './guards/admin.guard';

import { ScanComponent } from './components/scan/scan.component';
import { ParcelComponent } from './components/parcel/parcel.component';
import { LogComponent } from './components/log/log.component';
import { UserComponent } from './components/user/user.component';
import { CategoryComponent } from './components/category/category.component';
import { StatusComponent } from './components/status/status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';
import { dashboardResolver } from './dashboard.resolver';
import { ParcelNewComponent } from './components/parcel/parcel-new/parcel-new.component';
import { ParcelListComponent } from './components/parcel/parcel-list/parcel-list.component';
import { ParcelViewComponent } from './components/parcel/parcel-view/parcel-view.component';
import { PrintComponent } from './components/print/print.component';
import { PrintListComponent } from './components/print/print-list/print-list.component';
import { PrintBarcodeComponent } from './components/print/print-barcode/print-barcode.component';
import { PrintQrcodeComponent } from './components/print/print-qrcode/print-qrcode.component';
import { LogListComponent } from './components/log/log-list/log-list.component';
import { LogViewComponent } from './components/log/log-view/log-view.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [dashboardGuard],
    resolve: [dashboardResolver],
    children: [
      { path: '', redirectTo: 'scan', pathMatch: 'full' },
      { path: 'scan', component: ScanComponent },
      {
        path: 'parcel',
        component: ParcelComponent,
        children: [
          { path: '', component: ParcelListComponent },
          { path: 'new', component: ParcelNewComponent },
          { path: 'view/:id', component: ParcelViewComponent },
        ],
      },
      {
        path: 'print',
        component: PrintComponent,
        children: [
          { path: '', component: PrintListComponent },
          { path: 'barcode', component: PrintBarcodeComponent },
          { path: 'qrcode', component: PrintQrcodeComponent },
        ],
      },

      {
        path: 'log',
        component: LogComponent,
        children: [
          { path: '', component: LogListComponent },
          { path: 'view/:id', component: LogViewComponent },
        ],
      },
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
