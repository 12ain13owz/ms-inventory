import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Subscription, delayWhen, interval, tap } from 'rxjs';
import { StatusService } from '../../services/status/status.service';
import { StatusApiService } from '../../services/status/status-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Status } from '../../models/status.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StatusEditComponent } from './status-edit/status-edit.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'no',
    'name',
    'place',
    'active',
    'remark',
    'action',
  ];
  dataSource = new MatTableDataSource<Status>(null);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.subscription = this.statusService
      .onStatusesListener()
      .pipe(
        tap((statuses) => (this.dataSource.data = statuses)),
        delayWhen(() => (this.paginator ? interval(0) : interval(100)))
      )
      .subscribe(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
