import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Parcel, ParcelPrint } from '../../../models/parcel.model';
import { ActivatedRoute } from '@angular/router';
import { ParcelService } from '../../../services/parcel/parcel.service';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import { Subscription, finalize } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { PrintService } from '../../../services/print/print.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-parcel-view',
  templateUrl: './parcel-view.component.html',
  styleUrl: './parcel-view.component.scss',
})
export class ParcelViewComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private route = inject(ActivatedRoute);
  private parcelService = inject(ParcelService);
  private parcelApiService = inject(ParcelApiService);
  private printService = inject(PrintService);
  private snackBar = inject(MatSnackBar);
  private platfrom = inject(Platform);

  imageUrl: string = environment.imageUrl;

  title: string = 'รายละเอียด';
  isEdit: boolean = false;
  isStock: boolean = false;
  isLoading: boolean = false;
  id: number = +this.route.snapshot.params['id'];
  parcel: Parcel = this.parcelService.getParcelById(this.id);

  ngOnInit(): void {
    if (!this.parcel) {
      this.isLoading = true;
      this.parcelApiService
        .getParcelById(this.id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => res && (this.parcel = res));
    }

    this.subscription = this.parcelService
      .onParcelsListener()
      .subscribe(
        () => (this.parcel = this.parcelService.getParcelById(this.id))
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isEmpty(value: any): string | any {
    if (!value) return '-';
    return value;
  }

  onEdit() {
    this.isEdit = true;
  }

  onAddQuantity() {
    this.isStock = true;
  }

  onEditSuccess(parcel: Parcel) {
    this.isEdit = false;
    this.parcel = parcel;
  }

  onAddStockSuccess(parcel: Parcel) {
    this.isStock = false;
    this.parcel = parcel;
  }

  onPrint(): void {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    let verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    if (this.platfrom.ANDROID || this.platfrom.IOS) {
      horizontalPosition = 'center';
      verticalPosition = 'top';
    }

    this.snackBar.open('เพิ่มพัสดุไปยังหน้าปริ้น', 'ปิด', {
      duration: 2500,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
    if (this.printService.getParcelById(this.id)) return;

    const parcel: ParcelPrint = {
      id: this.parcel.id,
      image: this.parcel.image,
      track: this.parcel.track,
      quantity: this.parcel.quantity,
      print: this.parcel.print,
      printCount: this.parcel.quantity,
    };
    this.printService.createParcel(parcel);
  }
}
