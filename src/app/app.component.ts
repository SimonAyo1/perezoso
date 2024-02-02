import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'perezoso-raffle';
  showFooter: boolean = false;

  constructor() {
    setTimeout(() => {
      this.showFooter = true;
    }, 1000);
  }
}
