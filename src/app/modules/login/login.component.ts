import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoginService } from './services/login.service';
import { LoginForm, LoginRequest } from './models/login.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOGIN } from './constants/login,constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);

  validationField = LOGIN.validationField;
  form: LoginForm;
  isLoading: boolean = false;
  hidePassword: boolean = true;

  ngOnInit(): void {
    this.initForm();
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

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl('admin@test.com', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('!Qwer1234', {
        validators: [Validators.required],
      }),
    });
  }
}
