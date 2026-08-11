import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="product-card">
      <a [routerLink]="['/product', product.id]" class="product-image-link">
        <img [src]="product.image" [alt]="product.title" />
      </a>
      <div class="product-info">
        <div>
          <h3>
            <a [routerLink]="['/product', product.id]" class="product-title-link">
              {{ product.title }}
            </a>
          </h3>
          <p class="author">{{ product.author }}</p>
        </div>
        <p class="rating">⭐ {{ product.rating.toFixed(1) }}</p>
      </div>

      <p class="description">{{ product.description }}</p>
      <p class="stock-badge" [class.low-stock]="product.stock <= 5 && product.stock > 0" [class.out-of-stock]="product.stock === 0">
        {{ product.stock > 0 ? (product.stock <= 5 ? 'Estoque baixo' : 'Em estoque') : 'Sem estoque' }}
      </p>
      <div class="product-footer">
        <span class="price">R$ {{ product.price | number:'1.2-2' }}</span>
        <button
          type="button"
          [disabled]="product.stock === 0"
          (click)="addToCart()"
        >
          {{ product.stock === 0 ? 'Me avise quando tiver em estoque' : 'Adicionar ao carrinho' }}
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .product-card {
        border: 1px solid #dfe3e8;
        border-radius: 1rem;
        padding: 1rem;
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
        min-height: 100%;
      }
      .product-image-link {
        display: block;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      .product-image-link:hover {
        transform: scale(1.02);
      }
      .product-card img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 0.95rem;
      }
      .product-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }
      .product-info h3 {
        margin: 0;
        font-size: 1.05rem;
      }
      .product-title-link {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      .product-title-link:hover {
        color: #2563eb;
      }
      .author {
        margin: 0.25rem 0 0;
        color: #6b7280;
        font-size: 0.9rem;
      }
      .stock-badge {
        margin: 0;
        padding: 0.5rem 0.75rem;
        border-radius: 999px;
        display: inline-block;
        font-size: 0.8rem;
        font-weight: 700;
        color: #065f46;
        background: #d1fae5;
      }
      .stock-badge.low-stock {
        background: #fef3c7;
        color: #92400e;
      }
      .stock-badge.out-of-stock {
        background: #fee2e2;
        color: #991b1b;
      }
      .rating {
        font-weight: 700;
        color: #f59e0b;
      }
      .description {
        margin: 0;
        color: #4b5563;
        font-size: 0.95rem;
        line-height: 1.4;
      }
      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
      }
      .price {
        font-weight: 700;
        font-size: 1.1rem;
      }
      button {
        border: none;
        background: #2563eb;
        color: white;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      button:hover:not(:disabled) {
        background: #1d4ed8;
      }
    `
  ]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private readonly cartService = inject(CartService);

  addToCart() {
    this.cartService.add(this.product);
  }
}
