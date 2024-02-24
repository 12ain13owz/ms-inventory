import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Subject,
  Subscription,
  catchError,
  exhaustMap,
  finalize,
  of,
  tap,
  throwError,
} from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginService } from './services/login.service';
import { LoginForm, LoginRequest } from './models/login.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOGIN } from './constants/login.constant';
import { Router } from '@angular/router';
import { TokenService } from '../shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private router = inject(Router);
  private recaptchaV3Service = inject(ReCaptchaV3Service);
  private tokenService = inject(TokenService);
  private loginService = inject(LoginService);
  private loginRequest$ = new Subject<LoginRequest>();

  validationField = LOGIN.validationField;
  loginForm: LoginForm;
  isLoading: boolean = false;
  hidePassword: boolean = true;

  ngOnInit(): void {
    this.initLoginForm();

    this.subscription = this.recaptchaV3Service
      .execute('importantAction')
      .subscribe((token: string) => {
        // this.receptchaToken.setValue(token);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.tokenService.setAccessToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
        this.router.navigate(['/']);
      });
  }

  private initLoginForm(): void {
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
