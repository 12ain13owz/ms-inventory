import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  comparePassword(field: string[], form: FormGroup): ValidationErrors | null {
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

  isDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const isValidate = !isNaN(Date.parse(value));
      return isValidate ? null : { invalidDate: true };
    };
  }

  mimeType(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
      if (typeof control.value === 'string') return of(null);

      const file = control.value as File;
      const fileReader = new FileReader();
      const file$ = new Observable(
        (observer: Observer<{ [key: string]: any }>) => {
          fileReader.addEventListener('loadend', () => {
            const result = <ArrayBuffer>fileReader.result;
            const arr = new Uint8Array(result).subarray(0, 4);
            let header = '';
            let isValid = false;

            for (let i = 0; i < arr.length; i++) {
              header += arr[i].toString(16);
            }

            switch (header) {
              case '89504e47':
                isValid = true;
                break;
              case 'ffd8ffe0':
              case 'ffd8ffe1':
              case 'ffd8ffe2':
              case 'ffd8ffe3':
              case 'ffd8ffe8':
                isValid = true;
                break;
              default:
                isValid = false;
                break;
            }

            if (isValid) observer.next(null);
            else observer.next({ mimeType: true });

            observer.complete();
          });

          fileReader.readAsArrayBuffer(file);
        }
      );
      return file$;
    };
  }
}
