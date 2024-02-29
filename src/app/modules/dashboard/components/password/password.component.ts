import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroupDirective,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, Subscription, finalize, take } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { ProfileApiService } from '../../services/profile-api.service';
import { Password, PasswordForm, Profile } from '../../models/profile.model';
import { PASSWORD } from '../../constants/password.constant';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent implements OnInit {
  @ViewChild('formDirec') formDirec: FormGroupDirective;

  private profileService = inject(ProfileService);
  private profileApiService = inject(ProfileApiService);
  private formBuilder = inject(FormBuilder);

  form: PasswordForm;

  profile: Profile;
  isLoading: boolean = false;
  validationField = PASSWORD.validationField;
  patternPassword = PASSWORD.patternPassword;

  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  ngOnInit(): void {
    this.initForm();
    this.profile = this.profileService.getProfile();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const payload: Password = this.form.getRawValue();
    this.profileApiService
      .changePassword(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  onReset(): void {
    this.formDirec.resetForm();
  }

  get oldPassword(): FormControl<string> {
    return this.form.controls['oldPassword'];
  }

  get newPassword(): FormControl<string> {
    return this.form.controls['newPassword'];
  }

  get confirmPassword(): FormControl<string> {
    return this.form.controls['confirmPassword'];
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, Validators.pattern(this.patternPassword)],
        ],
        confirmPassword: [''],
      },
      { validator: this.comparePasswordValidator }
    );
  }

  private comparePasswordValidator(
    form: PasswordForm
  ): ValidationErrors | null {
    const newPassword = form.controls['newPassword'];
    const confirmPassword = form.controls['confirmPassword'];

    if (confirmPassword.value === '' && newPassword.value === '') {
      confirmPassword.setErrors({ required: true });
      return { required: true };
    }

    if (newPassword.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
      return null;
    }

    confirmPassword.setErrors({ match: true });
    return { match: true };
  }
}
