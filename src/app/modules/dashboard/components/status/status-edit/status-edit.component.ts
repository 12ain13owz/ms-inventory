import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Status,
  StatusForm,
  StatusResponse,
} from '../../../models/status.model';
import { StatusApiService } from '../../../services/status/status-api.service';
import { Message } from '../../../../shared/models/response.model';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { STATUS } from '../../../constants/status.constant';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrl: './status-edit.component.scss',
})
export class StatusEditComponent implements OnInit {
  @ViewChild('formDirec') formDirec: FormGroupDirective;
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StatusEditComponent>);
  private data: Status = inject(MAT_DIALOG_DATA);
  private statusApiService = inject(StatusApiService);
  private operation$: Observable<Message | StatusResponse>;

  form: StatusForm;
  title: string = 'เพิ่มสถานะพัสดุ';
  isEdit: boolean = false;
  isLoading: boolean = false;
  validationField = STATUS.validationField;

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.title = 'แก้ไขสถานะพัสดุ';
      this.isEdit = true;
      this.form.setValue({ id: this.data.id, ...this.data });
    }

    this.dialogRef.backdropClick().subscribe(() => {
      if (this.isEdit) this.editDialogBackdropHandler();
      else this.newDialogBackdropHandler();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (JSON.stringify(this.data) === JSON.stringify(this.form.value)) return;

    const { id, ...payload }: Status = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.statusApiService.updateStatus(id, payload)
      : this.statusApiService.createStatus(payload);

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

    this.nameInput.nativeElement.focus();
  }

  newDialogBackdropHandler() {
    const isChange = this.name.value !== '' || this.remark.value !== '';

    if (isChange) return this.confirmDialogBackdropHandler();
    this.dialogRef.close();
  }

  editDialogBackdropHandler() {
    const isChange =
      this.name.value !== this.data.name ||
      this.active.value !== this.data.active ||
      this.remark.value !== this.data.remark;

    if (isChange) return this.confirmDialogBackdropHandler();
    this.dialogRef.close();
  }

  confirmDialogBackdropHandler() {
    const confirmation = confirm('ต้องการยกเลิกการแก้ไขและออกจากฟอร์มหรือไม่?');
    if (confirmation) this.dialogRef.close();
  }

  get name() {
    return this.form.controls['name'];
  }

  get active() {
    return this.form.controls['active'];
  }

  get remark() {
    return this.form.controls['remark'];
  }

  private initForm(): void {
    this.form = this.formBuilder.nonNullable.group({
      id: [null],
      name: ['', Validators.required],
      active: [true, Validators.required],
      remark: [''],
    });
  }
}
