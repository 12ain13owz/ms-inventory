import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  private router = inject(Router);
  isExpanded: boolean = false;

  ngOnInit(): void {
    this.isExpanded = this.router.url.includes('setting');
  }
}
