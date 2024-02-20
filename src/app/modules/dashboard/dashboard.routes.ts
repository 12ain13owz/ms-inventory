import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ScanComponent } from './components/scan/scan.component';
import { ItemComponent } from './components/item/item.component';
import { LogComponent } from './components/log/log.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'scan', component: ScanComponent },
      { path: 'item', component: ItemComponent },
      { path: 'log', component: LogComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
