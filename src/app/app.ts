import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { ProductCardComponent } from './components/product-card.component';
import { CartPanelComponent } from './components/cart-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, CartPanelComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly products = this.productService.getAll();
  readonly totalProducts = this.products.length;
  readonly totalItems = this.cartService.totalQuantity;
}
