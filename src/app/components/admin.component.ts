import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="admin-page">
      <section class="admin-shell">
        <div class="admin-header">
          <h1>Painel de Administrador</h1>
          <p *ngIf="!authenticated()">Entre com a senha para acessar o painel.</p>
          <p *ngIf="authenticated()">Gerencie produtos: adicionar, editar e remover.</p>
        </div>

        <div class="admin-content">
          <ng-container *ngIf="!authenticated(); else panel">
            <form (ngSubmit)="login()" #loginForm="ngForm" class="login-form">
              <label>
                Senha de admin
                <input name="password" type="password" required [(ngModel)]="password" />
              </label>
              <div class="login-actions">
                <button type="submit" class="admin-back">Entrar</button>
                <a routerLink="/" class="admin-back secondary">Voltar à loja</a>
              </div>
              <p class="login-error" *ngIf="loginError">Senha incorreta.</p>
            </form>
          </ng-container>

          <ng-template #panel>
            <div class="admin-actions">
              <button class="admin-back" (click)="logout()">Sair</button>
              <button class="admin-back secondary" (click)="startAdd()">Adicionar produto</button>
            </div>

            <section class="admin-list">
              <h2>Produtos</h2>
              <ul>
                <li *ngFor="let p of products()">
                  <div class="meta">
                    <strong>{{ p.title }}</strong>
                    <small>{{ p.author }}</small>
                  </div>
                  <div class="actions">
                    <button (click)="startEdit(p)">Editar</button>
                    <button (click)="remove(p.id)">Apagar</button>
                  </div>
                </li>
              </ul>
            </section>

            <section class="admin-form" *ngIf="editing() || adding()">
              <h2 *ngIf="adding()">Adicionar produto</h2>
              <h2 *ngIf="editing()">Editar produto</h2>
              <form (ngSubmit)="save()">
                <label> Título <input name="title" required [(ngModel)]="form.title" /></label>
                <label> Autor <input name="author" required [(ngModel)]="form.author" /></label>
                <label> Preço <input name="price" type="number" required [(ngModel)]="form.price" /></label>
                <label> Estoque <input name="stock" type="number" required [(ngModel)]="form.stock" /></label>
                <label> Disponível <select name="available" [(ngModel)]="form.available">
                  <option [ngValue]="true">Sim</option>
                  <option [ngValue]="false">Não</option>
                </select></label>
                <label> Imagem URL <input name="image" [(ngModel)]="form.image" /></label>
                <label> Descrição <textarea name="description" [(ngModel)]="form.description"></textarea></label>
                <div class="form-actions">
                  <button type="submit" class="admin-back">Salvar</button>
                  <button type="button" class="admin-back secondary" (click)="cancel()">Cancelar</button>
                </div>
              </form>
            </section>
          </ng-template>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      .admin-page { min-height: 100vh; padding: 2rem 1rem; background: #f8fafc; }
      .admin-shell { max-width: 980px; margin: 0 auto; background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 20px 40px rgba(15,23,42,0.08); }
      .admin-header h1 { margin:0 0 .5rem; font-size:2rem }
      .admin-content { margin-top: 1rem }
      .admin-actions { display:flex; gap:.5rem; margin-bottom:1rem }
      .admin-back { display:inline-flex; padding:.6rem .9rem; border-radius:.6rem; background:#2563eb; color:#fff; text-decoration:none; border:none; cursor:pointer }
      .admin-back.secondary { background:#6b7280 }
      .admin-list ul { list-style:none; padding:0; margin:0; display:grid; gap:.5rem }
      .admin-list li { display:flex; justify-content:space-between; align-items:center; padding:.75rem; border:1px solid #e5e7eb; border-radius:.6rem }
      .admin-form { margin-top:1rem; border:1px solid #e2e8f0; padding:1rem; border-radius:.6rem; background:#f8fafc }
      label { display:block; margin-bottom:.5rem; font-weight:600 }
      input, textarea, select { width:100%; padding:.6rem .75rem; border-radius:.5rem; border:1px solid #cbd5e1 }
      .form-actions { display:flex; gap:.5rem; margin-top:.75rem }
      .login-form { max-width:420px }
      .login-actions { display:flex; gap:.5rem; margin-top:.5rem }
      .login-error { color:#ef4444; margin-top:.5rem }
    `
  ]
})
export class AdminComponent {
  private readonly productService = inject(ProductService);

  readonly products = this.productService.products;
  readonly authenticated = signal(false);
  password = '';
  loginError = false;

  readonly editing = signal(false);
  readonly adding = signal(false);
  editingProduct: Product | null = null;

  form: any = { title: '', author: '', price: 0, stock: 0, available: true, image: '', description: '' };

  login() {
    // senha simples para demo: "admin123"
    if (this.password.trim() === 'admin123') {
      this.authenticated.set(true);
      this.loginError = false;
      this.password = '';
    } else {
      this.loginError = true;
    }
  }

  logout() {
    this.authenticated.set(false);
    this.password = '';
  }

  startAdd() {
    this.adding.set(true);
    this.editing.set(false);
    this.editingProduct = null;
    this.form = { title: '', author: '', price: 0, stock: 0, available: true, image: '', description: '' };
  }

  startEdit(p: Product) {
    this.editing.set(true);
    this.adding.set(false);
    this.editingProduct = p;
    this.form = { ...p };
  }

  cancel() {
    this.editing.set(false);
    this.adding.set(false);
    this.editingProduct = null;
  }

  save() {
    if (this.editingProduct) {
      const updated: Product = { ...this.form, id: this.editingProduct.id };
      this.productService.update(updated);
    } else if (this.adding()) {
      const toCreate = { ...this.form } as Omit<Product, 'id'>;
      this.productService.create(toCreate);
    }
    this.cancel();
  }

  remove(id: number) {
    if (!confirm('Deseja realmente apagar este produto?')) return;
    this.productService.delete(id);
  }
}

