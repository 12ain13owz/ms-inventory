import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { Parcel, ParcelResponse } from '../../../models/parcel.model';
import { ValidationService } from '../../../../shared/services/validation.service';
import {
  Observable,
  catchError,
  defer,
  filter,
  finalize,
  forkJoin,
  interval,
  of,
  take,
  throwError,
} from 'rxjs';
import { CategoryApiService } from '../../../services/category/category-api.service';
import { StatusApiService } from '../../../services/status/status-api.service';
import { NgxDropzoneChangeEvent } from '@todorus/ngx-dropzone';
import { DatePipe } from '@angular/common';
import { PARCEL } from '../../../constants/parcel.constant';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import { Category } from '../../../models/category.model';
import { Status } from '../../../models/status.model';
import { ActivatedRoute } from '@angular/router';
import { ParcelService } from '../../../services/parcel/parcel.service';
import { environment } from '../../../../../../environments/environment.development';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';

@Component({
  selector: 'app-parcel-edit',
  templateUrl: './parcel-edit.component.html',
  styleUrl: './parcel-edit.component.scss',
})
export class ParcelEditComponent implements OnInit {
  @ViewChild('formDirec') formdirec: FormGroupDirective;
  @ViewChild('codeInput') codeInput: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput: ElementRef<HTMLInputElement>;

  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private parcelService = inject(ParcelService);
  private parcelApiService = inject(ParcelApiService);
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private datePipe = inject(DatePipe);
  private operation$: Observable<ParcelResponse>;

  imageUrl: string = environment.imageUrl;
  validationField = PARCEL.validationField;
  id: number = +this.route.snapshot.params['id'];
  files: File[] = [];
  title: string = 'เพิ่มพัสดุ';
  isImageEdit: boolean = false;
  isEdit: boolean = false;
  isLoading: boolean = false;
  isDataLoadFailed: boolean = false;
  categories: { id: number; name: string }[] = [];
  statuses: { id: number; name: string }[] = [];

  formParcel = this.initFormParcel();
  formImage = this.initFormImage();
  data: Parcel;
  track: string;

  ngOnInit(): void {
    this.categories = this.categoryService.getActiveCategories();
    this.statuses = this.statusService.getActiveStatuses();

    if (this.id) {
      this.isEdit = true;
      this.title = 'แก้ไขพัสดุ';
      this.data = this.parcelService.getParcelById(this.id);
      this.formParcel.disable();
    }

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
    if (this.isEdit) payload.append('imageEdit', this.isImageEdit.toString());

    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.parcelApiService.updateParcel(this.id, payload)
      : this.parcelApiService.createParcel(payload);

    this.operation$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastService.success('Success', res.message);
        if (!this.isEdit) this.onReset();
      });
  }

  onReset(): void {
    if (this.isEdit) {
      this.setParcelFormData(this.data);
      this.isImageEdit = false;
      return;
    } else this.formdirec.resetForm();

    this.files.length = 0;
    this.formImage.reset();
    this.formdirec.resetForm();
    this.category.markAsUntouched();
    this.status.markAsUntouched();
    this.codeInput.nativeElement.focus();
  }

  onEdit(): void {
    this.formParcel.enable();
    this.quantity.disable();
  }

  onSelectImage(event: NgxDropzoneChangeEvent): void {
    this.files.length = 0;
    this.files.push(...event.addedFiles);

    this.image.setValue(this.files[0]);
    this.image.markAsTouched();

    if (this.isEdit) this.isImageEdit = true;
  }

  onRemoveImage(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
    this.image.patchValue(null);

    if (this.isEdit) this.isImageEdit = true;
  }

  onDatePicker(event: MatDatepickerInputEvent<Date>): void {
    const day = event.value.getDate();
    const month = event.value.getMonth();
    const year = event.value.getFullYear();
    const date = new Date(year, month, day);

    this.dateInput.nativeElement.value = `${day}/${month + 1}/${year + 543}`;
    this.receivedDate.setValue(date);
  }

  onDateInput(): void {
    const [day, month, year] = this.dateInput.nativeElement.value.split('/');
    const date = new Date(+year - 543, +month - 1, +day);

    this.receivedDate.setValue(date);
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

    if (!this.isEdit) return;
    if (this.data) {
      this.setParcelFormData(this.data);
      return;
    }

    this.isLoading = true;
    this.parcelApiService
      .getParcelById(this.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.data = res;
          this.setParcelFormData(res);
        }
      });
  }

  private setParcelFormData(data: Parcel): void {
    if (data.image) {
      const downloadImageUrl = this.imageUrl + data.image;
      this.parcelApiService
        .downloadImage(downloadImageUrl)
        .subscribe((blob) => {
          const file = new File([blob], data.image, { type: blob.type });
          this.files.push(file);
        });
    }

    defer(() =>
      this.dateInput
        ? of(null)
        : interval(100).pipe(
            filter(() => !!this.dateInput),
            take(1)
          )
    ).subscribe(() => {
      this.formParcel.patchValue({
        code: data.code,
        oldCode: data.oldCode,
        receivedDate: new Date(data.receivedDate),
        quantity: data.quantity,
        detail: data.detail,
        remark: data.remark,
        category: data.Category.id,
        status: data.Status.id,
        image: data.image,
      });

      const receivedDateInput = new Date(data.receivedDate);
      receivedDateInput.setFullYear(receivedDateInput.getFullYear() + 543);
      const datePipe = this.datePipe.transform(receivedDateInput, 'd/M/yyyy');

      this.dateInput.nativeElement.value = datePipe;
      this.track = data.track;
    });
  }

  private initFormParcel() {
    return this.formBuilder.nonNullable.group({
      code: ['', [Validators.required]],
      oldCode: [''],
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
