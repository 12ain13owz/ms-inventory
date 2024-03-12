import { ResolveFn } from '@angular/router';
import { User } from '../models/user.model';
import { inject } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { UserApiService } from '../services/user/user-api.service';

export const userResolver: ResolveFn<User[]> = (route, state) => {
  const userService = inject(UserService);
  const userApiService = inject(UserApiService);
  const users = userService.getUsers();

  if (users.length <= 0) return userApiService.getUsers();
  return users;
};
