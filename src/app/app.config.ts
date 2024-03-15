import {
  APP_INITIALIZER,
  ApplicationConfig,
  Provider,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { JwtConfig, JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { authInterceptor } from './core/interceptor/auth.interceptor';

const config: JwtConfig = {
  tokenGetter: () => localStorage.getItem('accessToken'),
  allowedDomains: [environment.localhost],
};

export function loadCrucialData() {
  return function () {
    return delay(500);
  };
}

export function delay(delay: number) {
  return function () {
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  };
}

const providerSplashScreen: Provider = [
  { provide: APP_INITIALIZER, multi: true, useFactory: loadCrucialData() },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([errorInterceptor, authInterceptor])
      // withInterceptorsFromDi()
    ),
    provideToastr(),
    importProvidersFrom(JwtModule.forRoot({ config })),
    // providerSplashScreen,
  ],
};
