import { NgModule, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth.routes';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { LoginComponent } from './components/login/login.component';

const siteKey = environment.recaptcha.siteKey;
const provideRecaptcha: Provider = [
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: siteKey },
];

@NgModule({
  declarations: [AuthComponent, LoginComponent, ForgotPasswordComponent],
  imports: [AuthRoutingModule, CoreModule, SharedModule, RecaptchaV3Module],
  providers: [provideRecaptcha],
})
export class AuthModule {}
