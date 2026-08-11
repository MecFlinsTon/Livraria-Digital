import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'cart-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="cart-panel">
      <div class="cart-header">
        <div>
          <h2>Meu carrinho</h2>
          <p>{{ totalQuantity() }} itens</p>
        </div>
        <button type="button" class="clear-button" (click)="cartService.clear()">
          Limpar
        </button>
      </div>

      <ng-container *ngIf="items().length; else emptyCart">
        <ul class="cart-items">
          <li *ngFor="let item of items()" class="cart-item">
            <div>
              <strong>{{ item.product.title }}</strong>
              <p class="author">{{ item.product.author }}</p>
              <div class="quantity-row">
                <button type="button" (click)="updateQuantity(item.product.id, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button type="button" (click)="updateQuantity(item.product.id, item.quantity + 1)">+</button>
              </div>
            </div>
            <div class="price-block">
              <span>R$ {{ (item.product.price * item.quantity) | number:'1.2-2' }}</span>
              <button type="button" class="remove-button" (click)="cartService.remove(item.product.id)">Remover</button>
            </div>
          </li>
        </ul>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Total</span>
            <strong>R$ {{ totalPrice() | number:'1.2-2' }}</strong>
          </div>
          <div class="summary-row" *ngIf="cartService.discount() > 0">
            <span>Desconto</span>
            <strong>- R$ {{ cartService.discount() | number:'1.2-2' }}</strong>
          </div>
          <div class="summary-row total-after">
            <span>Total com desconto</span>
            <strong>R$ {{ cartService.totalAfterDiscount() | number:'1.2-2' }}</strong>
          </div>
          <button type="button" class="checkout-button" [disabled]="!items().length" [routerLink]="['/checkout']">
            Finalizar compra
          </button>
        </div>
      </ng-container>

      <ng-template #emptyCart>
        <p class="empty-text">Seu carrinho está vazio. Adicione um livro para começar.</p>
      </ng-template>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .cart-panel {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 1.25rem;
      }
      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .cart-header h2 {
        margin: 0;
        font-size: 1.25rem;
      }
      .cart-header p {
        margin: 0.25rem 0 0;
        color: #6b7280;
      }
      .clear-button {
        border: none;
        background: transparent;
        color: #ef4444;
        font-weight: 700;
        cursor: pointer;
      }
      .cart-items {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.85rem;
        background: #fff;
        border: 1px solid #e5e7eb;
      }
      .cart-item strong {
        display: block;
        margin-bottom: 0.25rem;
      }
      .author {
        margin: 0;
        color: #6b7280;
        font-size: 0.95rem;
      }
      .quantity-row {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }
      .quantity-row button {
        width: 2rem;
        height: 2rem;
        border-radius: 0.75rem;
        border: 1px solid #d1d5db;
        background: #fff;
        cursor: pointer;
      }
      .price-block {
        text-align: right;
        display: grid;
        gap: 0.5rem;
      }
      .remove-button {
        border: none;
        background: transparent;
        color: #ef4444;
        cursor: pointer;
        font-size: 0.95rem;
      }
      .cart-summary {
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
      .cart-summary span {
        color: #6b7280;
      }
      .checkout-button {
        border: none;
        background: #10b981;
        color: white;
        border-radius: 0.85rem;
        padding: 0.85rem 1rem;
        cursor: pointer;
      }
      .checkout-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .checkout-message {
        margin: 1rem 0 0;
        padding: 0.85rem 1rem;
        border-radius: 0.85rem;
        background: #d1fae5;
        color: #065f46;
        font-weight: 700;
        text-align: center;
      }
      .empty-text {
        margin: 0;
        color: #4b5563;
      }
    `
  ]
})
export class CartPanelComponent {
  public readonly cartService = inject(CartService);
  readonly items = this.cartService.items;
  readonly totalQuantity = this.cartService.totalQuantity;
  readonly totalPrice = this.cartService.totalPrice;
  readonly checkoutMessage = signal('');

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  completePurchase() {
    if (!this.items().length) {
      return;
    }

    this.cartService.clear();
    this.checkoutMessage.set('COMPRA FINALIZADA');

    setTimeout(() => {
      this.checkoutMessage.set('');
    }, 3000);
  }
}
