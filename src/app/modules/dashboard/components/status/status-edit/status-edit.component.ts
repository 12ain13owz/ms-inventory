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
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrl: './status-edit.component.scss',
})
export class StatusEditComponent implements OnInit {
  @ViewChild('formDirec') formdirec: FormGroupDirective;
  @ViewChild('name') name: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StatusEditComponent>);
  private data: Status = inject(MAT_DIALOG_DATA);
  private statusApiService = inject(StatusApiService);
  private operation$: Observable<Message | StatusResponse>;

  title: string = 'เพิ่มสถานะอุปกรณ์';
  isEdit: boolean = false;
  isLoading: boolean = false;
  form: StatusForm;

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.title = 'แก้ไขสถานะอุปกรณ์';
      this.isEdit = true;
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (JSON.stringify(this.data) === JSON.stringify(this.form.value)) return;

    const payload: Status = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.statusApiService.updateStatus(this.data.id, payload)
      : this.statusApiService.createStatus(payload);

    this.operation$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        if (this.isEdit) this.dialogRef.close();
        else this.onReset();
      });
  }

  onReset(): void {
    if (this.isEdit) this.form.patchValue(this.data);
    else this.formdirec.resetForm();

    this.name.nativeElement.focus();
  }

  private initForm(): void {
    this.form = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      place: [''],
      active: [true, Validators.required],
      remark: [''],
    });
  }
}
