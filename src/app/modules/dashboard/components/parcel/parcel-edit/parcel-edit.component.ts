import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import {
  Parcel,
  ParcelForm,
  ParcelResponse,
  selectChip,
} from '../../../models/parcel.model';
import { ValidationService } from '../../../../shared/services/validation.service';
import { Observable, catchError, finalize, forkJoin, throwError } from 'rxjs';
import { CategoryApiService } from '../../../services/category/category-api.service';
import { StatusApiService } from '../../../services/status/status-api.service';
import { NgxDropzoneChangeEvent } from '@todorus/ngx-dropzone';
import { DatePipe } from '@angular/common';
import { PARCEL } from '../../../constants/parcel.constant';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import {
  MatChipListbox,
  MatChipSelectionChange,
} from '@angular/material/chips';
import { Category } from '../../../models/category.model';
import { Status } from '../../../models/status.model';

@Component({
  selector: 'app-parcel-edit',
  templateUrl: './parcel-edit.component.html',
  styleUrl: './parcel-edit.component.scss',
})
export class ParcelEditComponent implements OnInit {
  @ViewChild('formDirec') formdirec: FormGroupDirective;
  @ViewChild('codeInput') codeInput: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipCategory') chipCategory: MatChipListbox;
  @ViewChild('chipStatus') chipStatus: MatChipListbox;

  private formBuilder = inject(FormBuilder);
  private parcelApiService = inject(ParcelApiService);
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private datePipe = inject(DatePipe);
  private data: Parcel;
  private operation$: Observable<ParcelResponse>;

  files: File[] = [];
  title: string = 'เพิ่มพัสดุ';
  isEdit: boolean = false;
  isLoading: boolean = false;
  isDataLoadFailed: boolean = false;
  id: number;
  selectDefault: selectChip = { category: null, status: null };

  form: ParcelForm;
  imagefile = new FormControl(null, {
    validators: [Validators.required],
    asyncValidators: [this.validationService.mimeType()],
  });
  categories: { id: number; name: string }[] = [];
  statuses: { id: number; name: string }[] = [];
  validationField = PARCEL.validationField;

  ngOnInit(): void {
    this.initForm();
    this.setValue();

    this.categories = this.categoryService.getActiveCategories();
    this.statuses = this.statusService.getActiveStatuses();
    this.onLoadCategoryAndStatus();
  }

  onSubmit(): void {
    console.log(this.category);

    if (this.form.invalid || this.imagefile.hasError('mimeType')) return;
    if (JSON.stringify(this.data) === JSON.stringify(this.form.value)) return;

    const receivedDate = this.datePipe.transform(
      this.receivedDate.value,
      'yyyy-MM-dd'
    );
    const categoryName = this.categories.find(
      (category) => category.id === this.category.value
    ).name;
    const statusName = this.statuses.find(
      (status) => status.id === this.status.value
    ).name;

    const payload = new FormData();
    payload.append('code', this.code.value);
    payload.append('oldCode', this.oldCode.value);
    payload.append('receivedDate', receivedDate);
    payload.append('detail', this.detail.value);
    payload.append('quantity', this.quantity.value.toString());
    payload.append('remark', this.remark.value);
    payload.append('image', this.imagefile.value);
    payload.append('categoryId', this.category.value.toString());
    payload.append('categoryName', categoryName);
    payload.append('statusId', this.status.value.toString());
    payload.append('statusName', statusName);

    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.parcelApiService.updateParcel(this.id, payload)
      : this.parcelApiService.createParcel(payload);

    this.operation$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.onReset());
  }

  onReset(): void {
    // if (this.isEdit) this.form.patchValue(this.data);
    // else this.formdirec.resetForm();

    this.files.length = 0;
    this.chipCategory.value = null;
    this.chipStatus.value = null;
    this.formdirec.resetForm();
    this.codeInput.nativeElement.focus();
  }

  onSelectImage(event: NgxDropzoneChangeEvent): void {
    this.files.length = 0;
    this.files.push(...event.addedFiles);
    this.imagefile.patchValue(this.files[0]);
  }

  onRemoveImage(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
    this.imagefile.patchValue(null);
  }

  onDatePicker(event: MatDatepickerInputEvent<Date>) {
    const day = event.value.getDate();
    const month = event.value.getMonth() + 1;
    const year = event.value.getFullYear();
    const date = new Date(year, month, day);

    this.dateInput.nativeElement.value = `${day}/${month}/${year + 543}`;
    this.receivedDate.setValue(date);
  }

  onDateInput() {
    const [day, month, year] = this.dateInput.nativeElement.value.split('/');
    const date = new Date(+year - 543, +month - 1, +day);

    this.receivedDate.setValue(date);
  }

  compareChip(chip1: number, chip2: number): boolean {
    return chip1 === chip2;
  }

  selectChip(chip: MatChipSelectionChange, keyName: string): void {
    if (chip.selected)
      return this.form.controls[keyName].patchValue(chip.source.value);

    this.form.controls[keyName].patchValue(null);
    this.form.controls[keyName].markAsTouched();
  }

  get code() {
    return this.form.controls['code'];
  }

  get oldCode() {
    return this.form.controls['oldCode'];
  }

  get receivedDate() {
    return this.form.controls['receivedDate'];
  }

  get quantity() {
    return this.form.controls['quantity'];
  }

  get detail() {
    return this.form.controls['detail'];
  }

  get remark() {
    return this.form.controls['remark'];
  }

  get category() {
    return this.form.controls['category'];
  }

  get status() {
    return this.form.controls['status'];
  }

  get image() {
    return this.form.controls['image'];
  }

  private onLoadCategoryAndStatus(): void {
    const operations$: Observable<Category[] | Status[]>[] = [];

    if (this.validationService.isEmpty(this.categories))
      operations$.push(this.categoryApiService.getCategories());

    if (this.validationService.isEmpty(this.statuses))
      operations$.push(this.statusApiService.getStatuses());

    if (!this.validationService.isEmpty(operations$)) {
      this.isLoading = true;
      forkJoin(operations$)
        .pipe(
          catchError((error) => {
            this.isDataLoadFailed = true;
            return throwError(() => error);
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((res) => {
          if (res.some((data) => this.validationService.isEmpty(data))) {
            this.isDataLoadFailed = true;
            return;
          }

          this.categories = this.categoryService.getActiveCategories();
          this.statuses = this.statusService.getActiveStatuses();
        });
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.nonNullable.group({
      id: [null],
      track: [null],
      code: ['', [Validators.required]],
      oldCode: [''],
      receivedDate: [
        { value: null },
        [Validators.required, this.validationService.isDate()],
      ],
      quantity: [{ value: null }, [Validators.required]],
      detail: ['', [Validators.required]],
      remark: [''],
      category: [{ value: null }, [Validators.required]],
      status: [{ value: null }, [Validators.required]],
      image: [''],
    });

    this.imagefile.markAsTouched();
  }

  private setValue() {
    this.form.setValue({
      id: null,
      track: null,
      code: 'MS-52147',
      oldCode: '',
      receivedDate: new Date(),
      quantity: 40,
      detail: 'test',
      remark: 'remark test',
      category: 1,
      status: 2,
      image: '',
    });

    this.selectDefault.category = this.category.value;
    this.selectDefault.status = this.status.value;
  }
}
