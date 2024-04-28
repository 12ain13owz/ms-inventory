import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { Parcel } from '../../../models/parcel.model';
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
import { environment } from '../../../../../../environments/environment';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';

@Component({
  selector: 'app-parcel-edit',
  templateUrl: './parcel-edit.component.html',
  styleUrl: './parcel-edit.component.scss',
})
export class ParcelEditComponent implements OnInit {
  @ViewChild('formDirec') fromDirec: FormGroupDirective;
  @ViewChild('codeInput') codeInput: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private parcelApiService = inject(ParcelApiService);
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private datePipe = inject(DatePipe);

  parcelInput = input<Parcel>();
  isEdit = output<Parcel>();

  validationField = PARCEL.validationField;
  imageUrl: string = environment.imageUrl;
  files: File[] = [];
  title: string = 'แก้ไขพัสดุ';
  isImageEdit: boolean = false;
  isLoading: boolean = false;
  isDataLoadFailed: boolean = false;
  categories: { id: number; name: string }[] = [];
  statuses: { id: number; name: string }[] = [];
  hiddenDateInput: string = '';

  formParcel = this.initFormParcel();
  formImage = this.initFormImage();
  track: string;
  parcel: Parcel;

  ngOnInit(): void {
    this.parcel = this.parcelInput();

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
    payload.append('imageEdit', this.isImageEdit.toString());
    payload.append('categoryId', this.category.value.toString());
    payload.append('categoryName', categoryName);
    payload.append('statusId', this.status.value.toString());
    payload.append('statusName', statusName);

    this.isLoading = true;
    this.parcelApiService
      .updateParcel(this.parcel.id, payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.parcel = res.parcel;
        this.toastService.success('Success', res.message);
        this.isEdit.emit(res.parcel);
      });
  }

  onReset(): void {
    this.files.length = 0;
    this.isImageEdit = false;
    this.hiddenDateInput = '';
    this.codeInput.nativeElement.focus();
    this.formImage.reset();
    this.setParcelFormData(this.parcel);
  }

  onSelectImage(event: NgxDropzoneChangeEvent): void {
    this.files.length = 0;
    this.files.push(...event.addedFiles);

    this.image.setValue(this.files[0]);
    this.image.markAsTouched();
    this.isImageEdit = true;
  }

  onRemoveImage(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
    this.image.patchValue(null);
    this.isImageEdit = true;
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

    this.setParcelFormData(this.parcel);
  }

  private setParcelFormData(parcel: Parcel): void {
    if (parcel.image) {
      const downloadImageUrl = this.imageUrl + parcel.image;
      this.parcelApiService
        .downloadImage(downloadImageUrl)
        .subscribe((blob) => {
          const file = new File([blob], parcel.image, { type: blob.type });
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
        code: parcel.code,
        oldCode: parcel.oldCode,
        receivedDate: new Date(parcel.receivedDate),
        quantity: parcel.quantity,
        detail: parcel.detail,
        remark: parcel.remark,
        category: parcel.Category.id,
        status: parcel.Status.id,
        image: parcel.image,
      });

      const receivedDateInput = new Date(parcel.receivedDate);
      receivedDateInput.setFullYear(receivedDateInput.getFullYear() + 543);
      const datePipe = this.datePipe.transform(receivedDateInput, 'd/M/yyyy');

      this.dateInput.nativeElement.value = datePipe;
      this.track = parcel.track;
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
      quantity: this.formBuilder.control<number>(
        { value: null, disabled: true },
        [Validators.required]
      ),
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
