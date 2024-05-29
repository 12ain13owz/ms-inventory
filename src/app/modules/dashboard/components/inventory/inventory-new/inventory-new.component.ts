import { fundSchema } from './../../../../../../../server/src/schemas/fund.schema';
import {
  Component,
  ElementRef,
  OnDestroy,
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
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { InventoryApiService } from '../../../services/inventory/inventory-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { FundService } from '../../../services/fund/fund.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';
import { DatePipe } from '@angular/common';
import { INVENTORY } from '../../../constants/inventory.constant';
import { Subscription, finalize } from 'rxjs';
import { NgxDropzoneChangeEvent } from '@todorus/ngx-dropzone';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { LocationService } from '../../../services/location/location.service';

@Component({
  selector: 'app-inventory-new',
  templateUrl: './inventory-new.component.html',
  styleUrl: './inventory-new.component.scss',
})
export class InventoryNewComponent implements OnInit, OnDestroy {
  @ViewChild('formDirec') fromDirec: FormGroupDirective;
  @ViewChild('codeEl') codeEl: ElementRef<HTMLInputElement>;
  @ViewChild('dateEl') dateEl: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker: MatDatepicker<Date>;

  private formBuilder = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private inventoryApiService = inject(InventoryApiService);
  private categoryService = inject(CategoryService);
  private statusService = inject(StatusService);
  private fundService = inject(FundService);
  private locationService = inject(LocationService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private datePipe = inject(DatePipe);

  private subscription = new Subscription();
  validationField = INVENTORY.validationField;
  files: File[] = [];
  title: string = 'เพิ่มครุภัณฑ์';
  isLoading: boolean = this.inventoryService.getIsLoading();
  remember: boolean = false;

  categories = this.categoryService.getActiveDetails();
  statuses = this.statusService.getActiveDetails();
  funds = this.fundService.getActiveDetails();
  locations = this.locationService.getActiveDetails();

  formInventory = this.initFormInventory();
  formImage = this.initFormImage();

  ngOnInit(): void {
    this.initSubscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.formInventory.invalid || this.image.hasError('mimeType')) return;

    const receivedDate = this.datePipe.transform(
      this.receivedDate.value,
      'yyyy-MM-dd'
    );

    const category = this.categories.find(
      (category) => category.id === this.category.value
    );
    const categoryName = category ? category.name : '';

    const status = this.statuses.find(
      (status) => status.id === this.status.value
    );
    const statusName = status ? status.name : '';

    const fund = this.funds.find((fund) => fund.id === this.fund.value);
    const fundName = fund ? fund.name : '';

    const location = this.locations.find(
      (location) => location.id === this.location.value
    );
    const locationName = location ? location.name : '';

    const payload = new FormData();
    payload.append('code', this.code.value);
    payload.append('oldCode', this.oldCode.value);
    payload.append('description', this.description.value);
    payload.append('unit', this.unit.value);
    payload.append('value', this.value.value);
    payload.append('receivedDate', receivedDate);
    payload.append('remark', this.remark.value);
    payload.append('image', this.image.value);
    payload.append('categoryId', this.category.value.toString());
    payload.append('categoryName', categoryName);
    payload.append('statusId', this.status.value.toString());
    payload.append('statusName', statusName);
    payload.append('fundId', this.fund.value.toString());
    payload.append('fundName', fundName);
    payload.append('locationId', this.location.value.toString());
    payload.append('locationName', locationName);

    this.isLoading = true;
    this.inventoryApiService
      .create(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastService.success('Success', res.message);
        this.code.setValue(this.setCode(this.code.value));

        if (!this.remember) this.onReset();
      });
  }

  onReset(): void {
    this.files.length = 0;
    this.codeEl.nativeElement.focus();
    this.formImage.reset();
    this.fromDirec.resetForm();
    this.category.markAsUntouched();
    this.status.markAsUntouched();
    this.fund.markAsUntouched();
    this.location.markAsUntouched();
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
    return this.formInventory.controls['code'];
  }

  get oldCode(): FormControl<string> {
    return this.formInventory.controls['oldCode'];
  }

  get dateInput(): FormControl<string> {
    return this.formInventory.controls['dateInput'];
  }

  get description(): FormControl<string> {
    return this.formInventory.controls['description'];
  }

  get unit(): FormControl<string> {
    return this.formInventory.controls['unit'];
  }

  get value(): FormControl<string> {
    return this.formInventory.controls['value'];
  }

  get receivedDate(): FormControl<Date> {
    return this.formInventory.controls['receivedDate'];
  }

  get remark(): FormControl<string> {
    return this.formInventory.controls['remark'];
  }

  get category(): FormControl<number> {
    return this.formInventory.controls['category'];
  }

  get status(): FormControl<number> {
    return this.formInventory.controls['status'];
  }

  get fund(): FormControl<number> {
    return this.formInventory.controls['fund'];
  }

  get location(): FormControl<number> {
    return this.formInventory.controls['location'];
  }

  get image(): FormControl<File> {
    return this.formImage;
  }

  private initFormInventory() {
    return this.formBuilder.nonNullable.group({
      code: ['', [Validators.required]],
      oldCode: [''],
      dateInput: ['', [Validators.required]],
      description: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      value: ['', [Validators.required]],
      receivedDate: this.formBuilder.control<Date>(null, [
        Validators.required,
        this.validationService.isDate(),
      ]),
      remark: [''],
      category: this.formBuilder.control<number>(null, [Validators.required]),
      status: this.formBuilder.control<number>(null, [Validators.required]),
      fund: this.formBuilder.control<number>(null, [Validators.required]),
      location: this.formBuilder.control<number>(null, [Validators.required]),
      image: [''],
    });
  }

  private initFormImage() {
    return this.formBuilder.control<File>(null, {
      validators: [Validators.required],
      asyncValidators: [this.validationService.mimeType()],
    });
  }

  private initSubscription(): void {
    this.subscription.add(
      this.categoryService
        .onListener()
        .subscribe(
          () => (this.categories = this.categoryService.getActiveDetails())
        )
    );

    this.subscription.add(
      this.statusService
        .onListener()
        .subscribe(
          () => (this.statuses = this.statusService.getActiveDetails())
        )
    );

    this.subscription.add(
      this.fundService
        .onListener()
        .subscribe(() => (this.funds = this.fundService.getActiveDetails()))
    );

    this.subscription.add(
      this.locationService
        .onListener()
        .subscribe(
          () => (this.locations = this.locationService.getActiveDetails())
        )
    );

    this.subscription.add(
      this.inventoryService
        .onIsLoadingListener()
        .subscribe((isLoading) => (this.isLoading = isLoading))
    );
  }

  private setCode(code: string): string {
    let parts = code.split('-');
    let lastPart = parts[parts.length - 1];
    let incrementedLastPart = (parseInt(lastPart) + 1)
      .toString()
      .padStart(4, '0');
    parts[parts.length - 1] = incrementedLastPart;

    return parts.join('-');
  }
}
