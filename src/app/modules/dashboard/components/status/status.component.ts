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
import { StatusService } from '../../services/status/status.service';
import { StatusApiService } from '../../services/status/status-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Status, StatusTable } from '../../models/status.model';
import { StatusEditComponent } from './status-edit/status-edit.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private subscription = new Subscription();
  private assetStatusService = inject(StatusService);
  private assetStatusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);

  title: string = 'รายการ สถานะครุภัณฑ์';
  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<StatusTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.assetStatusService
      .onStatusesListener()
      .subscribe(
        () =>
          (this.dataSource.data = this.assetStatusService.getStatusesTable())
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(StatusEditComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  onUpdate(assetStatus: Status): void {
    this.dialog.open(StatusEditComponent, {
      data: assetStatus,
      width: '500px',
      disableClose: true,
    });
  }

  onDelete(id: number): void {
    this.assetStatusApiService
      .deleteStatus(id)
      .subscribe((res) => this.toastService.info('Delete', res.message));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.assetStatusService.getStatusesTable();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.assetStatusApiService
        .getStatuses()
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
