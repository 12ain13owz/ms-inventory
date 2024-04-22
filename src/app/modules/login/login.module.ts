import { NgModule, Provider } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routes';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { environment } from '../../../environments/environment.development';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

const siteKey = environment.recaptcha.siteKey;
const provideRecaptcha: Provider = [
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: siteKey },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRoutingModule, CoreModule, SharedModule, RecaptchaV3Module],
  providers: [provideRecaptcha],
})
export class LoginModule {}
