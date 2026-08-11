import { Injectable, WritableSignal, signal, computed } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'livraria-digital-cart';
  private readonly cart = signal<CartItem[]>(this.loadCart());

  readonly items = this.cart;
  readonly totalQuantity = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );
  readonly discount = computed(() => {
    const total = this.totalPrice();
    if (total >= 200) {
      return total * 0.1;
    }
    if (total >= 100) {
      return total * 0.05;
    }
    return 0;
  });
  readonly totalAfterDiscount = computed(() =>
    this.totalPrice() - this.discount()
  );

  add(product: Product) {
    if (product.stock === 0) {
      return;
    }

    this.cart.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + 1, product.stock);
        return items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: nextQuantity }
            : item
        );
      }
      return [...items, { product, quantity: 1 }];
    });
    this.saveCart();
  }

  remove(productId: number) {
    this.cart.update((items) => {
      const next = items.filter((item) => item.product.id !== productId);
      return next;
    });
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cart.update((items) =>
      items
        .map((item) => {
          if (item.product.id !== productId) {
            return item;
          }

          if (quantity <= 0) {
            return null;
          }

          const safeQuantity = Math.min(quantity, item.product.stock);
          return { ...item, quantity: safeQuantity };
        })
        .filter((item): item is CartItem => item !== null)
    );
    this.saveCart();
  }

  clear() {
    this.cart.set([]);
    this.saveCart();
  }

  private loadCart(): CartItem[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved) as CartItem[];
      return parsed.filter(
        (item) =>
          item.product &&
          item.quantity > 0 &&
          item.quantity <= item.product.stock
      );
    } catch {
      return [];
    }
  }

  private saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart()));
    } catch {
      // ignore storage errors
    }
  }
}
