import { ResolveFn } from '@angular/router';

export const userResolver: ResolveFn<boolean> = (route, state) => {
  console.log(1);

  return true;
};
