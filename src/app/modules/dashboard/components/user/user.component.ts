import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription, defer, filter, interval, of, take } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { UserApiService } from '../../services/user/user-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../../models/user.model';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ValidationService } from '../../../shared/services/validation.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private profileService = inject(ProfileService);
  private userService = inject(UserService);
  private userApiService = inject(UserApiService);
  private validationService = inject(ValidationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'no',
    'email',
    'name',
    'role',
    'active',
    'remark',
    'action',
  ];
  dataSource = new MatTableDataSource<User>([]);
  pageIndex: number = 1;
  profileId = this.profileService.getProfile().id;

  ngOnInit(): void {
    this.dataSource.data = this.userService.getUsers();
    if (this.validationService.isEmpty(this.dataSource.data))
      this.userApiService.getUsers().subscribe();

    this.subscription = this.userService
      .onUsersListener()
      .subscribe((users) => (this.dataSource.data = users));
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
    this.dialog.open(UserEditComponent, {
      width: '500px',
    });
  }

  onUpdate(user: User): void {
    this.dialog.open(UserEditComponent, {
      data: user,
      width: '500px',
      disableClose: true,
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
