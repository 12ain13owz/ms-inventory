import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { User, UserResponse } from '../../../models/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryEditComponent } from '../../category/category-edit/category-edit.component';
import { UserApiService } from '../../../services/user/user-api.service';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { Message } from '../../../../shared/models/response.model';
import { ValidationService } from '../../../../shared/services/validation.service';
import { USER } from '../../../constants/user.constant';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
  @ViewChild('formDirec') formDirec: FormGroupDirective;
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryEditComponent>);
  private data: User = inject(MAT_DIALOG_DATA);
  private userApiService = inject(UserApiService);
  private validationService = inject(ValidationService);
  private operation$: Observable<Message | UserResponse>;

  validationField = USER.validationField;
  patternPassword = USER.patternPassword;

  form = this.initForm();
  title: string = 'เพิ่มผู้ใช้งาน';
  isEdit: boolean = false;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  roleOptions: string[] = ['user', 'admin'];

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.title = 'แก้ไขผู้ใข้งาน';
      this.isEdit = true;

      this.password.disable();
      this.confirmPassword.disable();
      this.form.clearValidators();
      this.form.patchValue(this.data);
    }

    this.dialogRef
      .keydownEvents()
      .subscribe((event) => event.key === 'Escape' && this.onCloseDialog());
    this.dialogRef.backdropClick().subscribe(() => this.onCloseDialog());
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (JSON.stringify(this.data) === JSON.stringify(this.form.value)) return;

    const { id, ...payload }: User = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.userApiService.updateUser(id, payload)
      : this.userApiService.createUser(payload);

    this.operation$
      .pipe(
        catchError((error) => {
          if (error.status === 0) this.dialogRef.close();
          return throwError(() => error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(() => {
        if (this.isEdit) this.dialogRef.close();
        else this.onReset();
      });
  }

  onReset(): void {
    if (this.isEdit) this.form.patchValue(this.data);
    else this.formDirec.resetForm();

    this.emailInput.nativeElement.focus();
  }

  newDialogBackdropHandler(): void {
    const isChange =
      this.email.value !== '' ||
      this.password.value !== '' ||
      this.confirmPassword.value !== '' ||
      this.firstname.value !== '' ||
      this.lastname.value !== '' ||
      this.role.value !== 'user' ||
      this.remark.value !== '';

    if (isChange) return this.confirmDialogBackdropHandler();
    this.dialogRef.close();
  }

  editDialogBackdropHandler(): void {
    const isChange =
      this.email.value !== this.data.email ||
      this.firstname.value !== this.data.firstname ||
      this.lastname.value !== this.data.lastname ||
      this.role.value !== this.data.role ||
      this.active.value !== this.data.active ||
      this.remark.value !== this.data.remark;

    if (isChange) return this.confirmDialogBackdropHandler();
    this.dialogRef.close();
  }

  confirmDialogBackdropHandler(): void {
    const confirmation = confirm('ต้องการยกเลิกการแก้ไขและออกจากฟอร์มหรือไม่?');
    if (confirmation) this.dialogRef.close();
  }

  onCloseDialog(): void {
    if (this.isEdit) this.editDialogBackdropHandler();
    else this.newDialogBackdropHandler();
  }

  get email(): FormControl<string> {
    return this.form.controls['email'];
  }

  get password(): FormControl<string> {
    return this.form.controls['password'];
  }

  get confirmPassword(): FormControl<string> {
    return this.form.controls['confirmPassword'];
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

  get active(): FormControl<boolean> {
    return this.form.controls['active'];
  }

  get remark(): FormControl<string> {
    return this.form.controls['remark'];
  }

  private initForm() {
    return this.formBuilder.nonNullable.group(
      {
        id: [null],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.patternPassword)],
        ],
        confirmPassword: [''],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        role: [
          'user',
          [Validators.required, this.validationService.oneOf(this.roleOptions)],
        ],
        active: [true, [Validators.required]],
        remark: [''],
      },

      {
        validators: this.validationService.comparePassword.bind(this, [
          'password',
          'confirmPassword',
        ]),
      }
    );
  }
}
