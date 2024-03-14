import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ErrorFieldComponent } from './components/error-field/error-field.component';
import { ValidationPipe } from './pipes/validation.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingDataComponent } from './components/loading-data/loading-data.component';

@NgModule({
  declarations: [ErrorFieldComponent, ValidationPipe, LoadingDataComponent],
  imports: [CoreModule, NgxSkeletonLoaderModule],
  exports: [ErrorFieldComponent, LoadingDataComponent],
})
export class SharedModule {}
