import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { SwitchMapComponent } from './switch-map/switch-map.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },

  { path: 'map', component: SwitchMapComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: '**', component: PageNotFoundComponent },
];
