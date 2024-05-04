import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { CategoryApiService } from '../../../services/category/category-api.service';
import { StatusService } from '../../../services/status/status.service';
import { StatusApiService } from '../../../services/status/status-api.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';
import { DatePipe } from '@angular/common';
import { Observable, catchError, finalize, forkJoin, throwError } from 'rxjs';
import { PARCEL } from '../../../constants/parcel.constant';
import { NgxDropzoneChangeEvent } from '@todorus/ngx-dropzone';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { Category } from '../../../models/category.model';
import { Status } from '../../../models/status.model';

@Component({
  selector: 'app-parcel-new',
  templateUrl: './parcel-new.component.html',
  styleUrl: './parcel-new.component.scss',
})
export class ParcelNewComponent {
  @ViewChild('formDirec') fromDirec: FormGroupDirective;
  @ViewChild('codeEl') codeEl: ElementRef<HTMLInputElement>;
  @ViewChild('dateEl') dateEl: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker: MatDatepicker<Date>;

  private formBuilder = inject(FormBuilder);
  private parcelApiService = inject(ParcelApiService);
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private datePipe = inject(DatePipe);

  validationField = PARCEL.validationField;
  files: File[] = [];
  title: string = 'เพิ่มพัสดุ';
  isLoading: boolean = false;
  isDataLoadFailed: boolean = false;
  categories: { id: number; name: string }[] = [];
  statuses: { id: number; name: string }[] = [];

  formParcel = this.initFormParcel();
  formImage = this.initFormImage();

  ngOnInit(): void {
    this.categories = this.categoryService.getActiveCategories();
    this.statuses = this.statusService.getActiveStatuses();

    this.initializeData();
  }

  onSubmit(): void {
    if (this.formParcel.invalid || this.image.hasError('mimeType')) return;

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
    payload.append('image', this.image.value);
    payload.append('categoryId', this.category.value.toString());
    payload.append('categoryName', categoryName);
    payload.append('statusId', this.status.value.toString());
    payload.append('statusName', statusName);

    this.isLoading = true;
    this.parcelApiService
      .createParcel(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastService.success('Success', res.message);
        this.onReset();
      });
  }

  onReset(): void {
    this.files.length = 0;
    this.codeEl.nativeElement.focus();
    this.formImage.reset();
    this.fromDirec.resetForm();
    this.category.markAsUntouched();
    this.status.markAsUntouched();
  }

  onSelectImage(event: NgxDropzoneChangeEvent): void {
    this.files.length = 0;
    this.files.push(...event.addedFiles);

    this.image.setValue(this.files[0]);
    this.image.markAsTouched();
  }

  onRemoveImage(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
    this.image.patchValue(null);
  }

  onDateInput(): void {
    const [d, m, y] = this.dateEl.nativeElement.value.split('/');
    const date = new Date(+y - 543, +m - 1, +d);

    this.receivedDate.setValue(date);
    if (this.receivedDate.errors)
      this.dateInput.setErrors(this.receivedDate.errors);

    if (!this.receivedDate.errors) {
      this.dateInput.setErrors(null);
      this.convertCEtoBE(date);
    }
  }

  onDatePicker(matDate: MatDatepickerInputEvent<Date>): void {
    const [d, m, y] = this.datePipe
      .transform(matDate.value, 'd/M/yyyy')
      .split('/');

    const date = `${d}/${m}/${+y + 543}`;
    this.dateInput.setValue(date);
  }

  convertCEtoBE(date: Date) {
    const [d, m, y] = this.datePipe.transform(date, 'd/M/yyyy').split('/');
    const currentYear = new Date().getFullYear();
    const yearBE = +y + 543;
    const dateCE = new Date(yearBE, +m - 1, +d);

    if (yearBE <= currentYear) {
      const [d, m, y] = this.datePipe.transform(dateCE, 'd/M/yyyy').split('/');
      const date = `${d}/${m}/${+y + 543}`;

      this.receivedDate.setValue(dateCE);
      this.dateInput.setValue(date);
    }
  }

  onSelectChip(keyName: string): void {
    this[keyName].markAsTouched();
  }

  get code(): FormControl<string> {
    return this.formParcel.controls['code'];
  }

  get oldCode(): FormControl<string> {
    return this.formParcel.controls['oldCode'];
  }

  get dateInput(): FormControl<string> {
    return this.formParcel.controls['dateInput'];
  }

  get receivedDate(): FormControl<Date> {
    return this.formParcel.controls['receivedDate'];
  }

  get quantity(): FormControl<number> {
    return this.formParcel.controls['quantity'];
  }

  get detail(): FormControl<string> {
    return this.formParcel.controls['detail'];
  }

  get remark(): FormControl<string> {
    return this.formParcel.controls['remark'];
  }

  get category(): FormControl<number> {
    return this.formParcel.controls['category'];
  }

  get status(): FormControl<number> {
    return this.formParcel.controls['status'];
  }

  get image(): FormControl<File> {
    return this.formImage;
  }

  private initializeData(): void {
    const operation$: Observable<Category[] | Status[]>[] = [];

    if (this.validationService.isEmpty(this.categories))
      operation$.push(this.categoryApiService.getCategories());
    if (this.validationService.isEmpty(this.statuses))
      operation$.push(this.statusApiService.getStatuses());

    if (!this.validationService.isEmpty(operation$)) {
      this.isLoading = true;
      forkJoin(operation$)
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

  private initFormParcel() {
    return this.formBuilder.nonNullable.group({
      code: ['', [Validators.required]],
      oldCode: [''],
      dateInput: ['', [Validators.required]],
      receivedDate: this.formBuilder.control<Date>(null, [
        Validators.required,
        this.validationService.isDate(),
      ]),
      quantity: this.formBuilder.control<number>(null, [Validators.required]),
      detail: ['', [Validators.required]],
      remark: [''],
      category: this.formBuilder.control<number>(null, [Validators.required]),
      status: this.formBuilder.control<number>(null, [Validators.required]),
      image: [''],
    });
  }

  private initFormImage() {
    return this.formBuilder.control<File>(null, {
      validators: [Validators.required],
      asyncValidators: [this.validationService.mimeType()],
    });
  }
}
