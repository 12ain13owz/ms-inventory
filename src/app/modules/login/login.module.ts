import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routes';
import { CoreModule } from '../../core/core.module';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../../../environments/environment.development';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRoutingModule, CoreModule, SharedModule, RecaptchaV3Module],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  ],
})
export class LoginModule {}
