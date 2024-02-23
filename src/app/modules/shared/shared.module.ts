import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ErrorFieldComponent } from './components/error-field/error-field.component';
import { ValidationPipe } from './pipes/validation.pipe';

@NgModule({
  declarations: [ErrorFieldComponent, ValidationPipe],
  imports: [CoreModule],
  exports: [ErrorFieldComponent],
})
export class SharedModule {}
