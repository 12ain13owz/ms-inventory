import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../../shared/models/response.model';

export interface Category {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface CategoryForm
  extends FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    active: FormControl<boolean>;
    remark: FormControl<string>;
  }> {}

export interface CategoryResponse extends Message {
  category: Category;
}
