import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryService } from '../services/category/category.service';
import { CategoryApiService } from '../services/category/category-api.service';
import { Category } from '../models/category.model';

export const categoryResolver: ResolveFn<Category[]> = (route, state) => {
  const categoryService = inject(CategoryService);
  const categoryApiService = inject(CategoryApiService);
  const categories = categoryService.getCategories();

  if (categories.length <= 0) return categoryApiService.getCategories();
  return categories;
};
