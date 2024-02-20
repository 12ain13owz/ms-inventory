import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Output() menuToggle = new EventEmitter();

  onMenuToggle() {
    this.menuToggle.emit();
  }
}
