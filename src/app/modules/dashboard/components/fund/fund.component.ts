import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  Subscription,
  defer,
  filter,
  finalize,
  interval,
  of,
  take,
} from 'rxjs';
import { FundService } from '../../services/fund/fund.service';
import { FundApiService } from '../../services/fund/fund-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Fund, FundTable } from '../../models/fund.model';
import { FundEditComponent } from './fund-edit/fund-edit.component';
import {
  SweetAlertComponent,
  SweetAlertInterface,
} from '../../../shared/components/sweet-alert/sweet-alert.component';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.scss', '../../scss/table-styles.scss'],
})
export class FundComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SweetAlertComponent) sweetAlert: SweetAlertInterface;

  private subscription = new Subscription();
  private fundService = inject(FundService);
  private fundApiService = inject(FundApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);

  title: string = 'รายชื่อแหล่งเงิน';
  sweetAlertTitle: string;
  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<FundTable>([]);
  isFirstLoading: boolean = false;
  id: number;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.fundService
      .onListener()
      .subscribe(
        () => (this.dataSource.data = this.fundService.getTableData())
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(FundEditComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  onUpdate(item: Fund): void {
    this.dialog.open(FundEditComponent, {
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

    this.fundApiService
      .delete(this.id)
      .subscribe((res) => this.toastService.info('Info', res.message));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.fundService.getTableData();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.fundApiService
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
