import { Message } from '../../shared/models/response.model';

export interface Category {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface CategoryResponse extends Message {
  category: Category;
}
