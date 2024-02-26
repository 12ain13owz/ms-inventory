import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserForm } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('firstname') firstname!: ElementRef<HTMLInputElement>;

  private subscription = new Subscription();
  private userService = inject(UserService);

  userForm: UserForm;
  passForm: FormGroup;

  ngOnInit(): void {
    this.initUserForm();
    this.subscription = this.userService.onUserListener().subscribe((user) =>
      this.userForm.setValue({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        remark: user.remark || '',
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    console.log(this.userForm.value);
  }

  onReset() {
    this.userForm.reset();
    this.firstname.nativeElement.focus();
  }

  private initUserForm(): void {
    this.userForm = new FormGroup({
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
