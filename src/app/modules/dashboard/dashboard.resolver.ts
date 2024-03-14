import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './services/user/user.service';
import { UserApiService } from './services/user/user-api.service';
import { CategoryService } from './services/category/category.service';
import { CategoryApiService } from './services/category/category-api.service';
import { StatusService } from './services/status/status.service';
import { StatusApiService } from './services/status/status-api.service';
import { Observable, forkJoin, map, of, tap } from 'rxjs';
import { ValidationService } from '../shared/services/validation.service';
import { LoadingScreenService } from '../../core/services/loading-screen.service';
import { ProfileService } from './services/profile/profile.service';

export const dashboardResolver: ResolveFn<boolean> = (route, state) => {
  const profileService = inject(ProfileService);
  const userService = inject(UserService);
  const userApiService = inject(UserApiService);
  const categoryService = inject(CategoryService);
  const categoryApiService = inject(CategoryApiService);
  const statusService = inject(StatusService);
  const statusApiService = inject(StatusApiService);
  const validationService = inject(ValidationService);
  const loadingScreenService = inject(LoadingScreenService);

  const isAdmin = profileService.isProfileAdmin();
  const users = validationService.isEmpty(userService.getUsers());
  const categories = validationService.isEmpty(categoryService.getCategories());
  const statuses = validationService.isEmpty(statusService.getStatuses());
  const operations$: Observable<any>[] = [];

  if (isAdmin && users) operations$.push(userApiService.getUsers());
  if (categories) operations$.push(categoryApiService.getCategories());
  if (statuses) operations$.push(statusApiService.getStatuses());

  if (!validationService.isEmpty(operations$)) {
    loadingScreenService.setIsLoading(true);

    return forkJoin(operations$).pipe(
      tap(() => loadingScreenService.setIsLoading(false)),
      map(() => true)
    );
  }
  return true;
};
