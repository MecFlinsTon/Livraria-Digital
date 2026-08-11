import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartService } from './cart.service';
import { Product } from '../models/product';

const mockProduct: Product = {
  id: 1,
  title: 'Teste',
  author: 'Autor',
  price: 50,
  image: 'https://example.com/book.jpg',
  rating: 4.5,
  description: 'Descrição',
  stock: 2,
  available: true
};

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorageMock.clear();
    service = new CartService();
  });

  it('should add item to cart', () => {
    service.add(mockProduct);
    expect(service.items()).toHaveLength(1);
    expect(service.totalQuantity()).toBe(1);
  });

  it('should not exceed stock when adding to cart', () => {
    service.add(mockProduct);
    service.add(mockProduct);
    service.add(mockProduct);

    expect(service.items()).toHaveLength(1);
    expect(service.totalQuantity()).toBe(2);
    expect(service.items()[0].quantity).toBe(2);
  });

  it('should update quantity but never exceed stock', () => {
    service.add(mockProduct);
    service.updateQuantity(mockProduct.id, 5);

    expect(service.items()[0].quantity).toBe(2);
  });

  it('should remove an item when quantity is zero or less', () => {
    service.add(mockProduct);
    service.updateQuantity(mockProduct.id, 0);

    expect(service.items()).toHaveLength(0);
  });

  it('should persist cart data in localStorage', () => {
    service.add(mockProduct);
    const saved = window.localStorage.getItem('livraria-digital-cart');

    expect(saved).not.toBeNull();
    expect(JSON.parse(saved as string)[0].quantity).toBe(1);
  });

  it('should ignore invalid cart items from localStorage on load', () => {
    window.localStorage.setItem(
      'livraria-digital-cart',
      JSON.stringify([{ product: mockProduct, quantity: 99 }])
    );

    const newService = new CartService();
    expect(newService.items()).toHaveLength(0);
  });
});
