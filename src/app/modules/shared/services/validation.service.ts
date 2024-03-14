import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  comparePasswordValidator(
    field: string[],
    form: FormGroup
  ): ValidationErrors | null {
    const password = form.controls[field[0]];
    const confirmPassword = form.controls[field[1]];

    if (password.value === '' && confirmPassword.value === '') {
      confirmPassword.setErrors({ required: true });
      return { required: true };
    }

    if (password.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
      return null;
    }

    confirmPassword.setErrors({ match: true });
    return { match: true };
  }

  oneOf(allowedValues: any[]): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      if (!control.value || allowedValues.includes(control.value)) return null;
      else return { oneOf: true };
    };
  }

  isEmpty(data: any[]): boolean {
    return !data || data.length === 0;
  }
}
