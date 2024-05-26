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
import { Usage, UsageResponse } from '../../../models/usage.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsageApiService } from '../../../services/usage/usage-api.service';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';
import { Message } from '../../../../shared/models/response.model';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { USAGE } from '../../../constants/usage.constant';

@Component({
  selector: 'app-usage-edit',
  templateUrl: './usage-edit.component.html',
  styleUrl: './usage-edit.component.scss',
})
export class UsageEditComponent implements OnInit {
  @ViewChild('formDirec') formDirec: FormGroupDirective;
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  private data: Usage = inject(MAT_DIALOG_DATA);
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsageEditComponent>);
  private usageApiService = inject(UsageApiService);
  private toastService = inject(ToastNotificationService);
  private operation$: Observable<Message | UsageResponse>;

  validationField = USAGE.validationField;
  title: string = 'เพิ่ม การใช้งานครุภัณฑ์';
  isEdit: boolean = false;
  isLoading: boolean = false;

  form = this.initForm();

  ngOnInit(): void {
    if (this.data) {
      this.title = 'แก้ไข การใช้งานครุภัณฑ์';
      this.isEdit = true;
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

    const { id, ...payload }: Usage = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.usageApiService.updateUsage(id, payload)
      : this.usageApiService.createUsage(payload);

    this.operation$
      .pipe(
        catchError((error) => {
          if (error.status === 0) this.dialogRef.close();
          return throwError(() => error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((res) => {
        if (this.isEdit) this.dialogRef.close();
        else this.onReset();

        this.toastService.success('Success', res.message);
      });
  }

  onReset(): void {
    if (this.isEdit) this.form.patchValue(this.data);
    else this.formDirec.resetForm();

    this.nameInput.nativeElement.focus();
  }

  newDialogBackdropHandler(): void {
    const isChange = this.name.value !== '' || this.remark.value !== '';

    if (isChange) return this.confirmDialogBackdropHandler();
    this.dialogRef.close();
  }

  editDialogBackdropHandler(): void {
    const isChange =
      this.name.value !== this.data.name ||
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

  get name(): FormControl<string> {
    return this.form.controls['name'];
  }

  get active(): FormControl<boolean> {
    return this.form.controls['active'];
  }

  get remark(): FormControl<string> {
    return this.form.controls['remark'];
  }

  private initForm() {
    return this.formBuilder.nonNullable.group({
      id: [null],
      name: ['', [Validators.required]],
      active: [true, [Validators.required]],
      remark: [''],
    });
  }
}
