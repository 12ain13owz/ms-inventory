import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { UserService } from './services/user/user.service';
import { UserApiService } from './services/user/user-api.service';
import { CategoryService } from './services/category/category.service';
import { CategoryApiService } from './services/category/category-api.service';
import { ValidationService } from '../shared/services/validation.service';
import { LoadingScreenService } from '../../core/services/loading-screen.service';
import { ProfileService } from './services/profile/profile.service';
import { User } from './models/user.model';
import { Category } from './models/category.model';
import { StatusApiService } from './services/status/status-api.service';
import { StatusService } from './services/status/status.service';
import { FundService } from './services/fund/fund.service';
import { FundApiService } from './services/fund/fund-api.service';
import { Status } from './models/status.model';
import { Fund } from './models/fund.model';
import { LocationService } from './services/location/location.service';
import { LocationApiService } from './services/location/location-api.service';
import { Location } from './models/location.model';

export const dashboardResolver: ResolveFn<boolean> = (route, state) => {
  const profileService = inject(ProfileService);
  const userService = inject(UserService);
  const userApiService = inject(UserApiService);
  const categoryService = inject(CategoryService);
  const categoryApiService = inject(CategoryApiService);
  const statusService = inject(StatusService);
  const statusApiService = inject(StatusApiService);
  const fundService = inject(FundService);
  const fundApiService = inject(FundApiService);
  const locationService = inject(LocationService);
  const locationApiService = inject(LocationApiService);
  const validationService = inject(ValidationService);
  const loadingScreenService = inject(LoadingScreenService);

  const isAdmin = profileService.isAdmin();
  const users = validationService.isEmpty(userService.getAll());
  const categories = validationService.isEmpty(categoryService.getAll());
  const statuses = validationService.isEmpty(statusService.getAll());
  const funds = validationService.isEmpty(fundService.getAll());
  const locations = validationService.isEmpty(locationService.getAll());
  const operations$: Observable<
    User[] | Category[] | Status[] | Fund[] | Location[]
  >[] = [];

  if (isAdmin && users) operations$.push(userApiService.getAll());
  if (categories) operations$.push(categoryApiService.getAll());
  if (statuses) operations$.push(statusApiService.getAll());
  if (funds) operations$.push(fundApiService.getAll());
  if (locations) operations$.push(locationApiService.getAll());

  if (!validationService.isEmpty(operations$)) {
    loadingScreenService.setIsLoading(true);

    return forkJoin(operations$).pipe(
      tap(() => loadingScreenService.setIsLoading(false)),
      map(() => true)
    );
  }
  return true;
};
