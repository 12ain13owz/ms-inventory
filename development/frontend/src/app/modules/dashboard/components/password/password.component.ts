import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileApiService } from '../../services/profile/profile-api.service';
import { Password, Profile } from '../../models/profile.model';
import { ValidationService } from '../../../shared/services/validation.service';
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
  private validationService = inject(ValidationService);

  patternPassword = PASSWORD.patternPassword;
  validationField = PASSWORD.validationField;
  title: string = 'เปลี่ยนรหัสผ่าน';
  isLoading: boolean = false;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  form = this.initForm();
  profile: Profile;

  ngOnInit(): void {
    this.profile = this.profileService.get();
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

  private initForm() {
    return this.formBuilder.nonNullable.group(
      {
        oldPassword: ['', [Validators.required]],
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
