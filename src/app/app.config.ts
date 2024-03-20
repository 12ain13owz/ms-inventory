import {
  ApplicationConfig,
  LOCALE_ID,
  Provider,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { JwtConfig, JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';

registerLocaleData(localeTh);
const provideDateLocale: Provider = [{ provide: LOCALE_ID, useValue: 'th-TH' }];
const jwtConfig: JwtConfig = {
  tokenGetter: () => localStorage.getItem('accessToken'),
  allowedDomains: [environment.localhost],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    provideDateLocale,
    provideNativeDateAdapter(),
    provideToastr(),
    importProvidersFrom(JwtModule.forRoot({ config: jwtConfig })),
  ],
};

// export function loadCrucialData() {
//   return function () {
//     return delay(500);
//   };
// }

// export function delay(delay: number) {
//   return function () {
//     return new Promise(function (resolve) {
//       setTimeout(resolve, delay);
//     });
//   };
// }

// const providerSplashScreen: Provider = [
//   { provide: APP_INITIALIZER, multi: true, useFactory: loadCrucialData() },
// ];
