import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { JwtConfig, JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { authInterceptor } from './core/interceptor/auth.interceptor';

const config: JwtConfig = {
  tokenGetter: () => localStorage.getItem('accessToken'),
  allowedDomains: [environment.localhost],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([ErrorInterceptor, authInterceptor]),
      withInterceptorsFromDi()
    ),
    provideToastr(),
    importProvidersFrom(JwtModule.forRoot({ config })),
  ],
};
