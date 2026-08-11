import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="product-detail">
      <button class="back-button" (click)="goBack()">← Voltar</button>

      <div *ngIf="product" class="product-container">
        <div class="product-image-section">
          <img [src]="product.image" [alt]="product.title" class="product-image" />
        </div>

        <div class="product-details-section">
          <h1 class="product-title">{{ product.title }}</h1>
          <p class="product-author">por {{ product.author }}</p>

          <div class="rating-section">
            <span class="stars">⭐ {{ product.rating.toFixed(1) }}</span>
            <span class="availability" [class.available]="product.stock > 0" [class.unavailable]="product.stock === 0">
              {{ product.stock > 0 ? '✓ Em estoque' : '✗ Esgotado' }}
            </span>
          </div>

          <div class="price-section">
            <span class="price">R$ {{ product.price | number:'1.2-2' }}</span>
          </div>

          <div class="stock-info">
            <span *ngIf="product.stock > 0" class="stock-available">{{ product.stock }} em estoque</span>
            <span *ngIf="product.stock === 0" class="stock-unavailable">Produto sem estoque</span>
            <span *ngIf="product.stock > 0 && product.stock <= 5" class="low-stock">Estoque baixo</span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <div class="additional-info">
            <div class="info-item">
              <h3>Sobre este livro</h3>
              <p>
                Este é um livro de qualidade premium da nossa livraria digital. Disponível em múltiplos formatos
                e com garantia de satisfação.
              </p>
            </div>
          </div>

          <div class="action-buttons">
            <button 
              class="add-to-cart-btn" 
              [disabled]="product.stock === 0 || isMaxInCart()"
              (click)="addToCart()"
              [attr.aria-label]="product.stock === 0 ? 'Produto sem estoque' : isMaxInCart() ? 'Limite de estoque atingido' : 'Adicionar ' + product.title + ' ao carrinho'"
            >
              {{ product.stock === 0 ? 'Me avise quando tiver em estoque' : isMaxInCart() ? 'Limite de estoque atingido' : '🛒 Adicionar ao carrinho' }}
            </button>
            <button class="wishlist-btn" [attr.aria-label]="'Adicionar ' + product.title + ' aos favoritos'">
              ♡ Adicionar aos favoritos
            </button>
          </div>

          <p class="product-note" *ngIf="isMaxInCart()">
            Você já tem {{ currentCartQuantity() }} deste produto no carrinho.
          </p>

          <p class="action-message" *ngIf="addedMessage()">{{ addedMessage() }}</p>
        </div>
      </div>

      <div *ngIf="!product && !loading" class="product-not-found">
        <h2>Produto não encontrado</h2>
        <p>Desculpe, não conseguimos encontrar o produto que você está procurando.</p>
        <button (click)="goBack()">Voltar à loja</button>
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .product-detail {
        min-height: 100vh;
        padding: 2rem 1rem;
        background: #f9fafb;
      }

      .back-button {
        background: none;
        border: none;
        color: #2563eb;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        transition: color 0.2s ease;
      }

      .back-button:hover {
        color: #1d4ed8;
      }

      .product-container {
        max-width: 1200px;
        margin: 2rem auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .product-image-section {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-image {
        width: 100%;
        max-width: 500px;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 1rem;
      }

      .product-details-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .product-title {
        font-size: 2rem;
        margin: 0;
        line-height: 1.2;
      }

      .product-author {
        font-size: 1.1rem;
        color: #6b7280;
        margin: 0;
      }

      .rating-section {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .stars {
        font-size: 1.2rem;
        font-weight: 600;
        color: #f59e0b;
      }

      .availability {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .availability.available {
        background: #d1fae5;
        color: #065f46;
      }

      .availability.unavailable {
        background: #fee2e2;
        color: #7f1d1d;
      }

      .price-section {
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      .price {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2563eb;
      }

      .product-description {
        font-size: 1rem;
        line-height: 1.6;
        color: #4b5563;
        margin: 0;
      }

      .additional-info {
        background: #f3f4f6;
        padding: 1.5rem;
        border-radius: 0.75rem;
      }

      .info-item h3 {
        margin: 0 0 0.5rem;
        font-size: 1rem;
      }

      .info-item p {
        margin: 0;
        font-size: 0.95rem;
        color: #6b7280;
        line-height: 1.5;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .add-to-cart-btn,
      .wishlist-btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .add-to-cart-btn {
        background: #2563eb;
        color: white;
        flex: 1;
      }

      .add-to-cart-btn:hover:not(:disabled) {
        background: #1d4ed8;
      }

      .add-to-cart-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .wishlist-btn {
        background: #f3f4f6;
        color: #2563eb;
        border: 2px solid #2563eb;
      }

      .wishlist-btn:hover {
        background: #e5e7eb;
      }

      .product-not-found {
        text-align: center;
        padding: 3rem 1rem;
      }

      .product-not-found h2 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
      }

      .product-not-found p {
        color: #6b7280;
        margin-bottom: 2rem;
      }

      .product-not-found button {
        padding: 0.75rem 2rem;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 0.75rem;
        cursor: pointer;
        font-size: 1rem;
      }

      .product-not-found button:hover {
        background: #1d4ed8;
      }

      .product-note,
      .action-message {
        margin-top: 1rem;
        padding: 0.9rem 1rem;
        border-radius: 0.85rem;
        background: #f8fafc;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }

      .action-message {
        background: #d1fae5;
        border-color: #a7f3d0;
        color: #065f46;
      }

      /* Responsividade */
      @media (max-width: 768px) {
        .product-detail {
          padding: 1rem;
        }

        .product-container {
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 1.5rem;
        }

        .product-title {
          font-size: 1.5rem;
        }

        .price {
          font-size: 1.5rem;
        }

        .action-buttons {
          flex-direction: column;
        }

        .wishlist-btn {
          flex: 1;
        }
      }

      @media (max-width: 480px) {
        .product-detail {
          padding: 1rem 0.5rem;
        }

        .product-container {
          padding: 1rem;
          gap: 1.5rem;
        }

        .product-title {
          font-size: 1.2rem;
        }

        .product-author {
          font-size: 1rem;
        }

        .price {
          font-size: 1.3rem;
        }

        .action-buttons {
          gap: 0.5rem;
        }

        .add-to-cart-btn,
        .wishlist-btn {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
        }
      }
    `
  ]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  loading = true;
  addedMessage = signal('');

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      this.product = this.productService.getById(id);
      this.loading = false;
    });
  }

  currentCartQuantity(): number {
    if (!this.product) {
      return 0;
    }
    const item = this.cartService.items().find((cartItem) => cartItem.product.id === this.product?.id);
    return item ? item.quantity : 0;
  }

  isMaxInCart(): boolean {
    return !!this.product && this.currentCartQuantity() >= this.product.stock;
  }

  addToCart() {
    if (!this.product || this.product.stock === 0 || this.isMaxInCart()) {
      return;
    }

    this.cartService.add(this.product);
    this.addedMessage.set('Produto adicionado ao carrinho!');

    setTimeout(() => {
      this.addedMessage.set('');
    }, 2800);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
