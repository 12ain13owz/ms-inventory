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
import { UserService } from '../../services/user/user.service';
import { UserApiService } from '../../services/user/user-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User, UserTable } from '../../models/user.model';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ValidationService } from '../../../shared/services/validation.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private subscription = new Subscription();
  private profileService = inject(ProfileService);
  private userService = inject(UserService);
  private userApiService = inject(UserApiService);
  private validationService = inject(ValidationService);
  private dialog = inject(MatDialog);

  title: string = 'รายการบัญชีผู้ใช้งาน';
  profileId = this.profileService.get().id;
  displayedColumns: string[] = [
    'no',
    'email',
    'name',
    'role',
    'active',
    'remark',
    'action',
  ];
  dataSource = new MatTableDataSource<UserTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.userService
      .onListener()
      .subscribe(
        () => (this.dataSource.data = this.userService.getTableData())
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(UserEditComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  onUpdate(item: User): void {
    this.dialog.open(UserEditComponent, {
      data: item,
      width: '500px',
      disableClose: true,
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.userService.getTableData();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.userApiService
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
