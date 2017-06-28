import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <fa-databinding></fa-databinding>
  `
})
export class AppComponent {
  delete = false;
  test = 'Starting value';
  boundValue = 1000;
}
