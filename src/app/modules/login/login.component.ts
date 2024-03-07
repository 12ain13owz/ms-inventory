import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginService } from './services/login.service';
import { LoginForm } from './models/login.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOGIN } from './constants/login.constant';
import { Router } from '@angular/router';
import { TokenService } from '../shared/services/token.service';
import { ProfileService } from '../dashboard/services/profile/profile.service';

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
  private profileService = inject(ProfileService);

  validationField = LOGIN.validationField;
  form: LoginForm;
  isLoading: boolean = false;
  hidePassword: boolean = true;

  ngOnInit(): void {
    this.initForm();

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
    if (this.form.invalid) return;

    this.isLoading = true;
    this.loginService
      .login(this.form.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.tokenService.setAccessToken(res.accessToken);
        this.profileService.setProfile(res.payload);
        this.router.navigate(['/']);
      });
  }

  get email(): FormControl<string> {
    return this.form.controls['email'];
  }

  get password(): FormControl<string> {
    return this.form.controls['password'];
  }

  get receptchaToken(): FormControl<string> {
    return this.form.controls['receptchaToken'];
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl('test@t.com', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('!Qwerty123', {
        validators: [Validators.required],
      }),
      receptchaToken: new FormControl(null),
    });
  }
}
