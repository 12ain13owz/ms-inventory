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
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryApiService } from '../../../services/inventory/inventory-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { UsageService } from '../../../services/usage/usage.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';
import { DatePipe } from '@angular/common';
import {
  Subscription,
  defer,
  filter,
  finalize,
  interval,
  of,
  take,
} from 'rxjs';
import { INVENTORY } from '../../../constants/inventory.constant';
import { NgxDropzoneChangeEvent } from '@todorus/ngx-dropzone';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../models/inventory.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrl: './inventory-edit.component.scss',
})
export class InventoryEditComponent implements OnInit, OnDestroy {
  @ViewChild('formDirec') fromDirec: FormGroupDirective;
  @ViewChild('codeEl') codeEl: ElementRef<HTMLInputElement>;
  @ViewChild('dateEl') dateEl: ElementRef<HTMLInputElement>;
  @ViewChild('picker') picker: MatDatepicker<Date>;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private inventoryApiService = inject(InventoryApiService);
  private categoryService = inject(CategoryService);
  private statusService = inject(StatusService);
  private usageService = inject(UsageService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private datePipe = inject(DatePipe);

  private subscription = new Subscription();
  validationField = INVENTORY.validationField;
  imageUrl: string = environment.imageUrl;
  files: File[] = [];
  title: string = 'แก้ไข ครุภัณฑ์';
  isImageEdit: boolean = false;
  isLoading: boolean = this.inventoryService.getIsLoading();

  categories = this.categoryService.getActiveCategories();
  statuses = this.statusService.getActiveStatuses();
  usages = this.usageService.getActiveUsages();
  id: number = +this.route.snapshot.params['id'];
  inventory: Inventory = this.inventoryService.getInventoryById(this.id);
  isInventory: boolean = false;

  formInventory = this.initFormInventory();
  formImage = this.initFormImage();

  ngOnInit(): void {
    this.initSubscription();

    if (this.inventory) this.setData(this.inventory);
    if (!this.inventory) {
      this.isInventory = true;
      this.inventoryApiService
        .getInventoryById(this.id)
        .pipe(finalize(() => (this.isInventory = false)))
        .subscribe((res) => {
          this.inventory = res;
          this.setData(this.inventory);
        });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.formInventory.invalid || this.image.hasError('mimeType')) return;

    this.onDateInput();
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
    const usageName = this.usages.find(
      (usage) => usage.id === this.usage.value
    ).name;

    const payload = new FormData();
    payload.append('code', this.code.value);
    payload.append('oldCode', this.oldCode.value);
    payload.append('description', this.description.value);
    payload.append('unit', this.unit.value);
    payload.append('value', this.value.value);
    payload.append('receivedDate', receivedDate);
    payload.append('fundingSource', this.fundingSource.value);
    payload.append('location', this.location.value);
    payload.append('remark', this.remark.value);
    payload.append('image', this.image.value);
    payload.append('imageEdit', this.isImageEdit.toString());
    payload.append('categoryId', this.category.value.toString());
    payload.append('categoryName', categoryName);
    payload.append('statusId', this.status.value.toString());
    payload.append('statusName', statusName);
    payload.append('usageId', this.usage.value.toString());
    payload.append('usageName', usageName);

    this.isLoading = true;
    this.inventoryApiService
      .updateInventory(this.id, payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastService.success('Success', res.message);
        this.router.navigate(['/inventory/view', this.id]);
      });
  }

  onReset(): void {
    this.files.length = 0;
    this.isImageEdit = false;
    this.codeEl.nativeElement.focus();
    this.formImage.reset();
    this.setData(this.inventory);
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

  lines(value: string): number {
    const lines = value.split('\n');
    return lines.length + 1;
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

  get fundingSource(): FormControl<string> {
    return this.formInventory.controls['fundingSource'];
  }

  get location(): FormControl<string> {
    return this.formInventory.controls['location'];
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

  get usage(): FormControl<number> {
    return this.formInventory.controls['usage'];
  }

  get image(): FormControl<File> {
    return this.formImage;
  }

  private setData(inventory: Inventory): void {
    if (!inventory) return;

    if (inventory.image) {
      const downloadImageUrl = this.imageUrl + inventory.image;
      this.inventoryApiService
        .downloadImage(downloadImageUrl)
        .subscribe((blob) => {
          const file = new File([blob], inventory.image, { type: blob.type });
          this.files.push(file);
        });
    }
    defer(() =>
      this.dateEl
        ? of(null)
        : interval(100).pipe(
            filter(() => !!this.dateEl),
            take(1)
          )
    ).subscribe(() => {
      this.formInventory.patchValue({
        code: inventory.code,
        oldCode: inventory.oldCode,
        description: inventory.description,
        unit: inventory.unit,
        value: inventory.value.toString(),
        receivedDate: new Date(inventory.receivedDate),
        fundingSource: inventory.fundingSource,
        location: inventory.location,
        remark: inventory.remark,
        category: inventory.Category.id,
        status: inventory.Status.id,
        usage: inventory.Usage.id,
        image: inventory.image,
      });

      const receivedDateInput = new Date(inventory.receivedDate);
      receivedDateInput.setFullYear(receivedDateInput.getFullYear() + 543);
      const datePipe = this.datePipe.transform(receivedDateInput, 'd/M/yyyy');
      this.dateInput.setValue(datePipe);
    });
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
      fundingSource: ['', [Validators.required]],
      location: ['', [Validators.required]],
      remark: [''],
      category: this.formBuilder.control<number>(null, [Validators.required]),
      status: this.formBuilder.control<number>(null, [Validators.required]),
      usage: this.formBuilder.control<number>(null, [Validators.required]),
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
        .onCategoriesListener()
        .subscribe(
          () => (this.categories = this.categoryService.getActiveCategories())
        )
    );

    this.subscription.add(
      this.statusService
        .onStatusesListener()
        .subscribe(
          () => (this.statuses = this.statusService.getActiveStatuses())
        )
    );

    this.subscription.add(
      this.usageService
        .onUsagesListener()
        .subscribe(() => (this.usages = this.usageService.getActiveUsages()))
    );

    this.subscription.add(
      this.inventoryService
        .onIsLoadingListener()
        .subscribe((isLoading) => (this.isLoading = isLoading))
    );

    this.subscription.add(
      this.inventoryService
        .onInventoriesListener()
        .subscribe(
          () =>
            (this.inventory = this.inventoryService.getInventoryById(this.id))
        )
    );
  }
}
