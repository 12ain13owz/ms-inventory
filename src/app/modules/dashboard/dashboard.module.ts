import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routes';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './layouts/toolbar/toolbar.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { ItemComponent } from './components/item/item.component';
import { LogComponent } from './components/log/log.component';
import { ScanComponent } from './components/scan/scan.component';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { CategoryComponent } from './components/category/category.component';
import { StatusComponent } from './components/status/status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    DashboardComponent,
    ToolbarComponent,
    SidenavComponent,
    ItemComponent,
    LogComponent,
    ScanComponent,
    UserComponent,
    CategoryComponent,
    StatusComponent,
    ProfileComponent,
  ],
  imports: [DashboardRoutingModule, CoreModule, SharedModule, FormsModule],
})
export class DashboardModule {}
