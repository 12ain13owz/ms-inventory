import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { FORGOT_PASSWORD } from '../../constants/forgot-password.constant';
import { MatStepper } from '@angular/material/stepper';
import { AuthApiService } from '../../services/auth-api.service';
import { catchError, concatMap, finalize, of } from 'rxjs';
import { ResetPasswordPayload } from '../../models/forgot-password';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  @ViewChild('stepper') stepper: MatStepper;

  private formBuilder = inject(FormBuilder);
  private authApiService = inject(AuthApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private id: number;

  validationField = FORGOT_PASSWORD.validationField;
  patternPassword = FORGOT_PASSWORD.patternPassword;
  isLoading: boolean = false;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  formEmail = this.initFormEmail();
  formVerified = this.initFormVerified();
  formResetPassword = this.initFormResetPassword();

  onSubmitEmail(): void {
    if (this.formEmail.invalid) return;
    const email = this.formEmail.getRawValue().email;

    this.isLoading = true;
    this.authApiService
      .forgetPassword(email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.id = res.id;
        this.stepper.next();
      });
  }

  onSubmitVerified(): void {
    if (this.formVerified.invalid) return;
    this.stepper.next();
  }

  onSubmitResetPassword(): void {
    if (this.formResetPassword.invalid) return;
    const payload: ResetPasswordPayload = {
      passwordResetCode: this.formVerified.getRawValue().passwordResetCode,
      newPassword: this.formResetPassword.getRawValue().newPassword,
      confirmPassword: this.formResetPassword.getRawValue().confirmPassword,
    };

    this.isLoading = true;
    this.authApiService
      .resetPassword(this.id, payload)
      .pipe(
        concatMap((res) => {
          this.toastService.success('Success', res.message);
          return this.authApiService.logout().pipe(catchError(() => of(null)));
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  get email(): FormControl<string> {
    return this.formEmail.controls['email'];
  }

  get passwordResetCode(): FormControl<string> {
    return this.formVerified.controls['passwordResetCode'];
  }

  get newPassword(): FormControl<string> {
    return this.formResetPassword.controls['newPassword'];
  }

  get confirmPassword(): FormControl<string> {
    return this.formResetPassword.controls['confirmPassword'];
  }

  private initFormEmail() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private initFormVerified() {
    return this.formBuilder.nonNullable.group({
      passwordResetCode: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
    });
  }

  private initFormResetPassword() {
    return this.formBuilder.nonNullable.group(
      {
        newPassword: [
          '',
          [Validators.required, Validators.pattern(this.patternPassword)],
        ],
        confirmPassword: [''],
      },
      {
        validators: this.validationService.comparePassword.bind(this, [
          'newPassword',
          'confirmPassword',
        ]),
      }
    );
  }
}
