import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxDropzoneModule } from '@todorus/ngx-dropzone';

@NgModule({
  imports: [
    SweetAlert2Module.forRoot({
      provideSwal: () => import('sweetalert2/dist/sweetalert2.js'),
    }),
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    SweetAlert2Module,
    LazyLoadImageModule,
    NgxDropzoneModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [DatePipe, provideNgxMask()],
})
export class CoreModule {}
