import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routes';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './layouts/toolbar/toolbar.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { LogComponent } from './components/log/log.component';
import { ScanComponent } from './components/scan/scan.component';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { CategoryComponent } from './components/category/category.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';
import { CategoryEditComponent } from './components/category/category-edit/category-edit.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PrintComponent } from './components/print/print.component';
import { PrintListComponent } from './components/print/print-list/print-list.component';
import { QRCodeModule } from 'angularx-qrcode';
import { LogListComponent } from './components/log/log-list/log-list.component';
import { LogViewComponent } from './components/log/log-view/log-view.component';
import { DispTextareaPipe } from './pipes/disp-textarea.pipe';
import { CutDetailPipe } from './pipes/cut-detail.pipe';
import { StatusComponent } from './components/status/status.component';
import { StatusEditComponent } from './components/status/status-edit/status-edit.component';
import { UsageComponent } from './components/usage/usage.component';
import { UsageEditComponent } from './components/usage/usage-edit/usage-edit.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryListComponent } from './components/inventory/inventory-list/inventory-list.component';
import { InventoryNewComponent } from './components/inventory/inventory-new/inventory-new.component';
import { InventoryViewComponent } from './components/inventory/inventory-view/inventory-view.component';
import { InventoryEditComponent } from './components/inventory/inventory-edit/inventory-edit.component';
import { PrintProcessComponent } from './components/print/print-process/print-process.component';
import { InventoryCheckComponent } from './components/inventory-check/inventory-check.component';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    ToolbarComponent,
    SidenavComponent,
    LogComponent,
    ScanComponent,
    UserComponent,
    CategoryComponent,
    ProfileComponent,
    PasswordComponent,
    CategoryEditComponent,
    UserEditComponent,
    PrintComponent,
    PrintListComponent,
    PrintProcessComponent,
    LogListComponent,
    LogViewComponent,
    DispTextareaPipe,
    CutDetailPipe,
    StatusComponent,
    StatusEditComponent,
    UsageComponent,
    UsageEditComponent,
    InventoryComponent,
    InventoryListComponent,
    InventoryNewComponent,
    InventoryViewComponent,
    InventoryEditComponent,
    InventoryCheckComponent,
    SearchPipe,
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
