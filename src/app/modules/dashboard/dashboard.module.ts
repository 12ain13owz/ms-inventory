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

@NgModule({
  declarations: [DashboardComponent, ToolbarComponent, SidenavComponent, ItemComponent, LogComponent, ScanComponent],
  imports: [DashboardRoutingModule, CoreModule, SharedModule],
})
export class DashboardModule {}
