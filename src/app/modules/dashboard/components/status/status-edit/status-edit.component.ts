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
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { Status } from '../../../models/status.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StatusApiService } from '../../../services/status/status-api.service';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';
import { ApiResponse } from '../../../../shared/models/response.model';
import { STATUS } from '../../../constants/status.constant';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrl: './status-edit.component.scss',
})
export class StatusEditComponent implements OnInit {
  @ViewChild('formDirec') formDirec: FormGroupDirective;
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  private data: Status = inject(MAT_DIALOG_DATA);
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StatusEditComponent>);
  private statusApiService = inject(StatusApiService);
  private toastService = inject(ToastNotificationService);
  private operation$: Observable<ApiResponse<Status>>;

  validationField = STATUS.validationField;
  title: string = 'เพิ่มสถานะ';
  isEdit: boolean = false;
  isLoading: boolean = false;

  form = this.initForm();

  ngOnInit(): void {
    if (this.data) {
      this.title = 'แก้ไขสถานะ';
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

    const { id, ...payload }: Status = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.statusApiService.update(id, payload)
      : this.statusApiService.create(payload);

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
