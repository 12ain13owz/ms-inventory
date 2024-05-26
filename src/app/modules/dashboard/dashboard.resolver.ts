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
import { UsageService } from './services/usage/usage.service';
import { UsageApiService } from './services/usage/usage-api.service';
import { Status } from './models/status.model';
import { Usage } from './models/usage.model';

export const dashboardResolver: ResolveFn<boolean> = (route, state) => {
  const profileService = inject(ProfileService);
  const userService = inject(UserService);
  const userApiService = inject(UserApiService);
  const categoryService = inject(CategoryService);
  const categoryApiService = inject(CategoryApiService);
  const statusService = inject(StatusService);
  const statusApiService = inject(StatusApiService);
  const usageService = inject(UsageService);
  const usageApiService = inject(UsageApiService);
  const validationService = inject(ValidationService);
  const loadingScreenService = inject(LoadingScreenService);

  const isAdmin = profileService.isProfileAdmin();
  const users = validationService.isEmpty(userService.getUsers());
  const categories = validationService.isEmpty(categoryService.getCategories());
  const statuses = validationService.isEmpty(statusService.getStatuses());
  const usages = validationService.isEmpty(usageService.getUsages());
  const operations$: Observable<User[] | Category[] | Status[] | Usage[]>[] =
    [];

  if (isAdmin && users) operations$.push(userApiService.getUsers());
  if (categories) operations$.push(categoryApiService.getCategories());
  if (statuses) operations$.push(statusApiService.getStatuses());
  if (usages) operations$.push(usageApiService.getUsages());

  if (!validationService.isEmpty(operations$)) {
    loadingScreenService.setIsLoading(true);

    return forkJoin(operations$).pipe(
      tap(() => loadingScreenService.setIsLoading(false)),
      map(() => true)
    );
  }
  return true;
};
