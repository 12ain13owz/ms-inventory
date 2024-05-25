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
import { UsageService } from '../../services/usage/usage.service';
import { UsageApiService } from '../../services/usage/usage-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Usage, UsageTable } from '../../models/usage.model';
import { UsageEditComponent } from './usage-edit/usage-edit.component';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.scss',
})
export class UsageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private subscription = new Subscription();
  private usageService = inject(UsageService);
  private usageApiService = inject(UsageApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<UsageTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.usageService
      .onUsagesListener()
      .subscribe(
        () => (this.dataSource.data = this.usageService.getUsagesTable())
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(UsageEditComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  onUpdate(usageStatus: Usage): void {
    this.dialog.open(UsageEditComponent, {
      data: usageStatus,
      width: '500px',
      disableClose: true,
    });
  }

  onDelete(id: number): void {
    this.usageApiService
      .deleteUsage(id)
      .subscribe((res) => this.toastService.info('Delete', res.message));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.usageService.getUsagesTable();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.usageApiService
        .getUsages()
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
