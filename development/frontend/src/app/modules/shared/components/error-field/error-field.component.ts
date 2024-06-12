import { Component, Input, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-error-field',
  templateUrl: './error-field.component.html',
  styleUrl: './error-field.component.scss',
})
export class ErrorFieldComponent {
  @Input() control: FormControl | AbstractControl;
  @Input() errorMessage: Record<string, unknown>;
  formDirective = inject(FormGroupDirective);
}
