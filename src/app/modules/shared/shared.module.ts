import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ErrorFieldComponent } from './components/error-field/error-field.component';
import { ValidationPipe } from './pipes/validation.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [ErrorFieldComponent, ValidationPipe, LoaderComponent],
  imports: [CoreModule, NgxSkeletonLoaderModule],
  exports: [ErrorFieldComponent, LoaderComponent],
})
export class SharedModule {}
