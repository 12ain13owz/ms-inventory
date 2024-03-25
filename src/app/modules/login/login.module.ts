import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routes';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRoutingModule, CoreModule, SharedModule],
})
export class LoginModule {}
