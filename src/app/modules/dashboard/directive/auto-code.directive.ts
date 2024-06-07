import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoCode]',
})
export class AutoCodeDirective {
  private regex: RegExp = new RegExp(/^[0-9-]*$/);
  private specialKeys: Array<string> = [
    'Enter',
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
  ];
  private isBackspace = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.isBackspace = true;
      return;
    }

    if (
      this.specialKeys.indexOf(event.key) !== -1 ||
      (event.ctrlKey && ['a', 'x', 'c', 'v'].indexOf(event.key) !== -1)
    ) {
      return;
    }

    if (event.key && !String(event.key).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    if (this.isBackspace) {
      this.isBackspace = false;
      return;
    }
    let value = this.el.nativeElement.value;

    if (value.length == 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length == 5) value = value.slice(0, 5) + '-' + value.slice(6);
    if (value.length == 12) value = value.slice(0, 12) + '-' + value.slice(13);
    if (value.length == 16) value = value.slice(0, 16) + '-' + value.slice(17);
    if (value.length == 22) value = value.slice(0, 22) + '-' + value.slice(22);

    this.el.nativeElement.value = value;
  }
}
