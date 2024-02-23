import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Subject,
  Subscription,
  catchError,
  exhaustMap,
  finalize,
  of,
  tap,
} from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginService } from './services/login.service';
import { LoginForm, LoginModel } from './models/login.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOGIN } from './constants/login.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private router = inject(Router);
  private recaptchaV3Service = inject(ReCaptchaV3Service);
  private loginService = inject(LoginService);
  private loginRequest$ = new Subject<LoginModel>();

  validationField = LOGIN.validationField;
  loginForm: LoginForm;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.initLoginForm();

    this.subscription.add(
      this.recaptchaV3Service
        .execute('importantAction')
        .subscribe((token: string) => {
          this.receptchaToken.setValue(token);
        })
    );

    this.subscription.add(
      this.loginRequest$
        .pipe(
          tap(() => (this.isLoading = true)),
          exhaustMap((data) =>
            this.loginService.login(data).pipe(
              catchError((error) => of(error.message)),
              finalize(() => (this.isLoading = false))
            )
          )
        )
        .subscribe((res) => {
          console.log(res);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loginRequest$.next(this.loginForm.getRawValue());
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('test@t.com', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('123456', {
        validators: [Validators.required],
      }),
      receptchaToken: new FormControl(null),
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  get receptchaToken() {
    return this.loginForm.controls['receptchaToken'];
  }
}
