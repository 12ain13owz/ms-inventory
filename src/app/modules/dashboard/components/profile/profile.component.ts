import { ProfileApiService } from '../../services/profile/profile-api.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { Profile, ProfileForm } from '../../models/profile.model';
import { FormBuilder, Validators } from '@angular/forms';
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

  form: ProfileForm;
  profile: Profile;
  isLoading: boolean = false;
  validationField = PROFILE.validationField;

  ngOnInit(): void {
    this.subscription = this.profileService
      .onProfileListener()
      .subscribe((profile) => {
        this.profile = profile;
        this.initForm();
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
    this.form.reset();
  }

  get email() {
    return this.form.controls['email'];
  }

  get firstname() {
    return this.form.controls['firstname'];
  }

  get lastname() {
    return this.form.controls['lastname'];
  }

  get role() {
    return this.form.controls['role'];
  }

  private initForm(): void {
    this.form = this.formBuilder.nonNullable.group({
      email: [this.profile.email, [Validators.required, Validators.email]],
      firstname: [this.profile.firstname, [Validators.required]],
      lastname: [this.profile.lastname, [Validators.required]],
      role: [
        { value: this.profile.role, disabled: true },
        [Validators.required],
      ],
      remark: [this.profile.remark],
    });
  }
}
