import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Subscription } from 'rxjs';
import { ProfileForm } from '../../models/profile.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('firstname') firstname!: ElementRef<HTMLInputElement>;

  private subscription = new Subscription();
  private profileService = inject(ProfileService);

  profileForm: ProfileForm;

  ngOnInit(): void {
    this.initProfileForm();
    this.subscription = this.profileService
      .onProfileListener()
      .subscribe((profile) =>
        this.profileForm.setValue({
          email: profile.email,
          firstname: profile.firstname,
          lastname: profile.lastname,
          role: profile.role,
          remark: profile.remark || '',
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }

  onReset() {
    this.profileForm.reset();
    this.firstname.nativeElement.focus();
  }

  private initProfileForm(): void {
    this.profileForm = new FormGroup({
      email: new FormControl(
        { value: null, disabled: true },
        {
          validators: [Validators.required, Validators.email],
        }
      ),
      firstname: new FormControl(null, {
        validators: [Validators.required],
      }),
      lastname: new FormControl(null, {
        validators: [Validators.required],
      }),
      role: new FormControl(
        { value: null, disabled: true },
        {
          validators: [Validators.required],
        }
      ),
      remark: new FormControl({ value: null, disabled: true }),
    });
  }
}
