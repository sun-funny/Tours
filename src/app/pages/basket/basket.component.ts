import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BasketService } from '../../services/basket.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ITour } from '../../models/tours';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [TableModule, AsyncPipe, ButtonModule, CurrencyPipe],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent {
  private basketService = inject(BasketService);
  basketItems$ = this.basketService.basketStore$;

  removeItem(tour: ITour): void {
    this.basketService.removeItemFromBasket(tour);
  }
}
