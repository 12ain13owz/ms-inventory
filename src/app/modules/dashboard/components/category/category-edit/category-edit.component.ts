import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { CategoryApiService } from '../../../services/category/category-api.service';
import {
  Category,
  CategoryForm,
  CategoryResponse,
} from '../../../models/category.model';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { Message } from '../../../../shared/models/response.model';
import { CATEGORY } from '../../../constants/category.constant';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss',
})
export class CategoryEditComponent implements OnInit {
  @ViewChild('formDirec') formdirec: FormGroupDirective;
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryEditComponent>);
  private data: Category = inject(MAT_DIALOG_DATA);
  private categoryApiService = inject(CategoryApiService);
  private operation$: Observable<Message | CategoryResponse>;

  form: CategoryForm;
  title: string = 'เพิ่มประเภทพัสดุ';
  isEdit: boolean = false;
  isLoading: boolean = false;
  validationField = CATEGORY.validationField;

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.title = 'แก้ไขประเภทพัสดุ';
      this.isEdit = true;
      this.form.setValue({ id: this.data.id, ...this.data });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (JSON.stringify(this.data) === JSON.stringify(this.form.value)) return;

    const { id, ...payload }: Category = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.categoryApiService.updateCategory(id, payload)
      : this.categoryApiService.createCategory(payload);

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
    else this.formdirec.resetForm();

    this.nameInput.nativeElement.focus();
  }

  get name() {
    return this.form.controls['name'];
  }

  private initForm(): void {
    this.form = this.formBuilder.nonNullable.group({
      id: [null],
      name: ['', [Validators.required]],
      active: [true, [Validators.required]],
      remark: [''],
    });
  }
}
