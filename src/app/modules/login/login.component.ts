import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { LoginService } from './services/login.service';
import { LoginRequest } from './models/login.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LOGIN } from './constants/login,constant';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private recaptchaV3Service = inject(ReCaptchaV3Service);

  validationField = LOGIN.validationField;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  form = this.initForm();

  ngOnInit(): void {
    this.initForm();

    this.subscription = this.recaptchaV3Service
      .execute('importantAction')
      .subscribe((token) => this.recaptcha.setValue(token));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload: LoginRequest = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.loginService
      .login(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => this.router.navigate(['/']));
  }

  get email(): FormControl<string> {
    return this.form.controls['email'];
  }

  get password(): FormControl<string> {
    return this.form.controls['password'];
  }

  get recaptcha(): FormControl<string> {
    return this.form.controls['recaptcha'];
  }

  private initForm() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]],
    });
  }
}
