import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routes';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRoutingModule, CoreModule],
})
export class LoginModule {}
