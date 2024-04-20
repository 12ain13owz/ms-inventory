import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routes';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './layouts/toolbar/toolbar.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { ParcelComponent } from './components/parcel/parcel.component';
import { LogComponent } from './components/log/log.component';
import { ScanComponent } from './components/scan/scan.component';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { CategoryComponent } from './components/category/category.component';
import { StatusComponent } from './components/status/status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';
import { CategoryEditComponent } from './components/category/category-edit/category-edit.component';
import { StatusEditComponent } from './components/status/status-edit/status-edit.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { ParcelEditComponent } from './components/parcel/parcel-edit/parcel-edit.component';
import { ParcelNewComponent } from './components/parcel/parcel-new/parcel-new.component';
import { ParcelListComponent } from './components/parcel/parcel-list/parcel-list.component';
import { ParcelViewComponent } from './components/parcel/parcel-view/parcel-view.component';
import { ParcelAddStockComponent } from './components/parcel/parcel-add-stock/parcel-add-stock.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PrintComponent } from './components/print/print.component';
import { PrintListComponent } from './components/print/print-list/print-list.component';
import { PrintBarcodeComponent } from './components/print/print-barcode/print-barcode.component';
import { PrintQrcodeComponent } from './components/print/print-qrcode/print-qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    DashboardComponent,
    ToolbarComponent,
    SidenavComponent,
    LogComponent,
    ScanComponent,
    UserComponent,
    CategoryComponent,
    StatusComponent,
    ProfileComponent,
    PasswordComponent,
    CategoryEditComponent,
    StatusEditComponent,
    UserEditComponent,
    ParcelComponent,
    ParcelListComponent,
    ParcelViewComponent,
    ParcelNewComponent,
    ParcelEditComponent,
    ParcelAddStockComponent,
    PrintComponent,
    PrintListComponent,
    PrintBarcodeComponent,
    PrintQrcodeComponent,
  ],
  imports: [
    DashboardRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    NgxBarcode6Module,
    QRCodeModule,
  ],
})
export class DashboardModule {}
