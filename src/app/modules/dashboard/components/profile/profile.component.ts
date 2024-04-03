import { ProfileApiService } from '../../services/profile/profile-api.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { Profile } from '../../models/profile.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { PROFILE } from '../../constants/profile.constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private profileService = inject(ProfileService);
  private ProfileApiService = inject(ProfileApiService);
  private formBuilder = inject(FormBuilder);

  validationField = PROFILE.validationField;

  form = this.initForm();
  profile: Profile;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.subscription = this.profileService
      .onProfileListener()
      .subscribe((profile) => {
        this.profile = profile;
        this.form.patchValue(this.profile);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload: Partial<Profile> = { ...this.form.value };
    this.isLoading = true;
    this.ProfileApiService.updateProfile(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  onReset(): void {
    this.form.patchValue(this.profile);
  }

  get email(): FormControl<string> {
    return this.form.controls['email'];
  }

  get firstname(): FormControl<string> {
    return this.form.controls['firstname'];
  }

  get lastname(): FormControl<string> {
    return this.form.controls['lastname'];
  }

  get role(): FormControl<string> {
    return this.form.controls['role'];
  }

  get remark(): FormControl<string> {
    return this.form.controls['remark'];
  }

  private initForm() {
    return this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      role: [{ value: '', disabled: true }, [Validators.required]],
      remark: [''],
    });
  }
}
