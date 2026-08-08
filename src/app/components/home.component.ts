import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ProductCardComponent } from './product-card.component';
import { CartPanelComponent } from './cart-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, CartPanelComponent],
  template: `
    <main class="store-shell">
      <section class="hero-panel">
        <div class="hero-copy">
          <h2 class="brand-name">BibliON</h2>
          <p class="eyebrow-subtitle">Sua biblioteca, sempre online</p>
          <h1>Descubra livros incríveis para ler agora.</h1>
          <p>Uma vitrine com livros populares, carrinho rápido e layout responsivo para testar sua loja online.</p>
        </div>
        <div class="hero-stats">
          <div>
            <strong>{{ totalProducts }}</strong>
            <span>Livros disponíveis</span>
          </div>
          <div>
            <strong>{{ totalItems() }}</strong>
            <span>Itens no carrinho</span>
          </div>
        </div>
      </section>

      <section class="store-grid">
        <div class="product-grid">
          <product-card *ngFor="let product of products" [product]="product"></product-card>
        </div>
        <aside class="cart-aside">
          <cart-panel></cart-panel>
        </aside>
      </section>
    </main>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly products = this.productService.getAll();
  readonly totalProducts = this.products.length;
  readonly totalItems = this.cartService.totalQuantity;
}
