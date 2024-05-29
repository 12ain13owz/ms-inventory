import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LocationService } from '../../services/location/location.service';
import { LocationApiService } from '../../services/location/location-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { MatDialog } from '@angular/material/dialog';
import {
  Subscription,
  defer,
  filter,
  finalize,
  interval,
  of,
  take,
} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Location, LocationTable } from '../../models/location.model';
import { LocationEditComponent } from './location-edit/location-edit.component';
import {
  SweetAlertComponent,
  SweetAlertInterface,
} from '../../../shared/components/sweet-alert/sweet-alert.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss', '../../scss/table-styles.scss'],
})
export class LocationComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SweetAlertComponent) sweetAlert: SweetAlertInterface;

  private locationService = inject(LocationService);
  private locationApiService = inject(LocationApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);
  private subscription = new Subscription();

  title: string = 'รายชื่อห้อง';
  sweetAlertTitle: string;
  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<LocationTable>([]);
  isFirstLoading: boolean = false;
  id: number;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.locationService
      .onListener()
      .subscribe(
        () => (this.dataSource.data = this.locationService.getTableData())
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(LocationEditComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  onUpdate(item: Location): void {
    this.dialog.open(LocationEditComponent, {
      data: item,
      width: '500px',
      disableClose: true,
    });
  }

  onConfirm(id: number, title: string): void {
    this.id = id;
    this.sweetAlertTitle = `ยืนยันการลบ ${title}?`;
    this.sweetAlert.alert(this.sweetAlertTitle);
  }

  onDelete(confirm: boolean): void {
    if (!confirm) return;

    this.locationApiService
      .delete(this.id)
      .subscribe((res) => this.toastService.info('Info', res.message));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.locationService.getTableData();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.locationApiService
        .getAll()
        .pipe(finalize(() => (this.isFirstLoading = true)))
        .subscribe();

    defer(() =>
      this.paginator && this.sort
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.paginator && !!this.sort),
            take(1)
          )
    ).subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
