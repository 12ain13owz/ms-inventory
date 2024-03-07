import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Status } from '../models/status.model';
import { StatusService } from '../services/status/status.service';
import { StatusApiService } from '../services/status/status-api.service';

export const statusResolver: ResolveFn<Status[]> = (route, state) => {
  const statusService = inject(StatusService);
  const statusApiService = inject(StatusApiService);
  const statuses = statusService.getStatuses();

  if (statuses.length <= 0) return statusApiService.getStatuses();
  return statuses;
};
