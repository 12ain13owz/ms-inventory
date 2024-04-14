import { Component, OnInit, inject } from '@angular/core';
import { Parcel } from '../../../models/parcel.model';
import { ActivatedRoute } from '@angular/router';
import { ParcelService } from '../../../services/parcel/parcel.service';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import { finalize } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-parcel-view',
  templateUrl: './parcel-view.component.html',
  styleUrl: './parcel-view.component.scss',
})
export class ParcelViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private parcelService = inject(ParcelService);
  private parcelApiService = inject(ParcelApiService);

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
  }

  isEmpty(value: any): string | any {
    if (!value) return '-';
    return value;
  }

  onEdit() {
    this.isEdit = true;
  }

  onQuantity() {
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
}
