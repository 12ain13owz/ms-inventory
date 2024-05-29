import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ErrorFieldComponent } from './components/error-field/error-field.component';
import { ValidationPipe } from './pipes/validation.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingDataComponent } from './components/loading-data/loading-data.component';
import { ThaiYearPipe } from './pipes/thai-year.pipe';
import { ToArrayPipe } from './pipes/to-array.pipe';
import { SweetAlertComponent } from './components/sweet-alert/sweet-alert.component';
import { RefreshTokenComponent } from './components/refresh-token/refresh-token.component';

@NgModule({
  declarations: [
    ErrorFieldComponent,
    SweetAlertComponent,
    LoadingDataComponent,
    RefreshTokenComponent,
    ValidationPipe,
    ThaiYearPipe,
    ToArrayPipe,
  ],
  imports: [CoreModule, NgxSkeletonLoaderModule],
  exports: [
    ErrorFieldComponent,
    LoadingDataComponent,
    SweetAlertComponent,
    RefreshTokenComponent,
    ThaiYearPipe,
    ToArrayPipe,
  ],
})
export class SharedModule {}
