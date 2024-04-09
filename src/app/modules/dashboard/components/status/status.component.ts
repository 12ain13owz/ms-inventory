import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { Status, StatusTable } from '../../models/status.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StatusEditComponent } from './status-edit/status-edit.component';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private subscription = new Subscription();
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<StatusTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.statusService
      .onStatusesListener()
      .subscribe(
        () => (this.dataSource.data = this.statusService.getStatusesTable())
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

  onUpdate(status: Status): void {
    this.dialog.open(StatusEditComponent, {
      data: status,
      width: '500px',
      disableClose: true,
    });
  }

  onDelete(id: number): void {
    this.statusApiService.deleteStatus(id).subscribe((res) => {
      this.toastService.info('Delete', res.message);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.statusService.getStatusesTable();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.statusApiService
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
