import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
})
export class CoreModule {}
