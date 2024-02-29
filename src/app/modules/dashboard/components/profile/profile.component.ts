import { ProfileApiService } from './../../services/profile-api.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Profile, ProfileForm } from '../../models/profile.model';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription, finalize } from 'rxjs';

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
    this.isLoading = true;

    const payload: Partial<Profile> = { ...this.form.value };
    this.ProfileApiService.updateProfile(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  onReset(): void {
    this.form.reset();
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
