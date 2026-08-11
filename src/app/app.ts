import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="app-header">
      <a routerLink="/" class="brand">BibliON</a>
      <nav class="app-nav">
        <a routerLink="/" class="nav-link">Loja</a>
        <a routerLink="/admin" class="nav-link">Admin</a>
        <a routerLink="/checkout" class="nav-link cart-link" aria-label="Ver carrinho">
          🛒
          <span class="badge" *ngIf="cartService.totalQuantity() > 0">{{ cartService.totalQuantity() }}</span>
        </a>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.css']
})
export class App {
  readonly cartService = inject(CartService);
}
