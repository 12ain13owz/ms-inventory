import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Subscription, delayWhen, interval, tap } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { UserApiService } from '../../services/user/user-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../../models/user.model';
import { UserEditComponent } from './user-edit/user-edit.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private userService = inject(UserService);
  private userApiService = inject(UserApiService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'no',
    'email',
    'name',
    'role',
    'active',
    'remark',
    'action',
  ];
  dataSource = new MatTableDataSource<User>(null);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.subscription = this.userService
      .onUsersListener()
      .pipe(
        tap((users) => (this.dataSource.data = users)),
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
    this.dialog.open(UserEditComponent, {
      width: '500px',
    });
  }

  onUpdate(user: User): void {
    this.dialog.open(UserEditComponent, {
      data: user,
      width: '500px',
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
