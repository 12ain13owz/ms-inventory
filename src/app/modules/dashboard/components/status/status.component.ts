import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription, defer, filter, interval, of, take } from 'rxjs';
import { StatusService } from '../../services/status/status.service';
import { StatusApiService } from '../../services/status/status-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Status } from '../../models/status.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StatusEditComponent } from './status-edit/status-edit.component';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private validationService = inject(ValidationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<Status>([]);
  pageIndex: number = 1;

  ngOnInit(): void {
    this.dataSource.data = this.statusService.getStatuses();
    if (this.validationService.isEmpty(this.dataSource.data))
      this.statusApiService.getStatuses().subscribe();

    this.subscription = this.statusService
      .onStatusesListener()
      .subscribe((statuses) => (this.dataSource.data = statuses));
  }

  ngAfterViewInit(): void {
    defer(() =>
      this.paginator && this.sort
        ? of(null)
        : interval(100).pipe(
            filter(() => !!this.paginator && !!this.sort),
            take(1)
          )
    ).subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setPageIndex(event: PageEvent): void {
    this.pageIndex = event.pageIndex * event.pageSize + 1;
  }

  onCreate(): void {
    this.dialog.open(StatusEditComponent, {
      width: '500px',
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
    this.statusApiService.deleteStatus(id).subscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
