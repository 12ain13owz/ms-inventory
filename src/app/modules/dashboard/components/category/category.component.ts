import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  private http = inject(HttpClient);

  onClick() {
    const id = 10;

    for (let userId = 0; userId < id; userId++) {
      this.http.post('http://localhost:3000/test', { userId }).subscribe();
    }
  }
}
