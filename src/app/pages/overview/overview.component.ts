import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  amountToPay: number = 0.0;
  TICKET_PRICE: number = 1000;

  calculateAmountToPay(event: any) {
    this.amountToPay = parseFloat(event.target.value) * this.TICKET_PRICE;
  }
}
