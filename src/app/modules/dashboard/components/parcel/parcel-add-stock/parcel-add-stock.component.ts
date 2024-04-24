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
import { environment } from '../../../../../../environments/environment';
import { PARCEL } from '../../../constants/parcel.constant';
import { Parcel } from '../../../models/parcel.model';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import { finalize } from 'rxjs';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';

@Component({
  selector: 'app-parcel-add-stock',
  templateUrl: './parcel-add-stock.component.html',
  styleUrl: './parcel-add-stock.component.scss',
})
export class ParcelAddStockComponent implements OnInit {
  @ViewChild('formDirec') fromDirec: FormGroupDirective;
  @ViewChild('stockInput', { static: true })
  stockInput: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private parcelApiService = inject(ParcelApiService);
  private toastService = inject(ToastNotificationService);

  parcelInput = input<Parcel>();
  isAddStock = output<Parcel>();

  validationField = PARCEL.validationField;
  imageUrl: string = environment.imageUrl;
  title: string = 'เพื่มสต็อก';
  isLoading: boolean = false;

  form = this.initForm();
  parcel: Parcel;

  ngOnInit(): void {
    this.parcel = this.parcelInput();
    this.form.patchValue(this.parcel);
    this.stockInput.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (this.stock.value <= 0) return;

    this.isLoading = true;
    this.parcelApiService
      .incrementParcel(+this.id.value, +this.stock.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.parcel.quantity = res.quantity;
        this.toastService.success('Success', res.message);
        this.isAddStock.emit(this.parcel);
      });
  }

  onReset(): void {
    this.stock.setValue(null);
    this.stockInput.nativeElement.focus();
  }

  get id(): FormControl<number> {
    return this.form.controls['id'];
  }

  get stock(): FormControl<number> {
    return this.form.controls['stock'];
  }

  private initForm() {
    return this.formBuilder.group({
      id: this.formBuilder.control<number>(null),
      stock: this.formBuilder.control<number>(null, [Validators.required]),
    });
  }
}
