import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { User, UserForm, UserResponse } from '../../../models/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryEditComponent } from '../../category/category-edit/category-edit.component';
import { UserApiService } from '../../../services/user/user-api.service';
import { Observable } from 'rxjs';
import { Message } from '../../../../shared/models/response.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  @ViewChild('formDirec') formdirec: FormGroupDirective;
  @ViewChild('email') name: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryEditComponent>);
  private data: User = inject(MAT_DIALOG_DATA);
  private userApiService = inject(UserApiService);
  private operation$: Observable<Message | UserResponse>;

  isEdit: boolean = false;
  isLoading: boolean = false;
  form: UserForm;
  title: string = 'เพิ่มผู้ใช้งาน';
}
