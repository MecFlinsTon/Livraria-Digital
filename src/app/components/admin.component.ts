import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="admin-page">
      <section class="admin-shell">
        <div class="admin-header">
          <h1>Painel de Administrador</h1>
          <p>Esta página serve como um painel de admin para futuros recursos de gestão.</p>
        </div>
        <div class="admin-content">
          <div class="admin-card">
            <h2>Visão geral</h2>
            <p>Aqui poderão ser adicionadas funcionalidades de controle de produtos, estoque e pedidos.</p>
          </div>
          <div class="admin-actions">
            <a routerLink="/" class="admin-back">Voltar à loja</a>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      .admin-page {
        min-height: 100vh;
        padding: 2rem 1rem;
        background: #f8fafc;
      }
      .admin-shell {
        max-width: 980px;
        margin: 0 auto;
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
      }
      .admin-header h1 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
      }
      .admin-header p {
        margin: 0;
        color: #475569;
      }
      .admin-card {
        margin-top: 1.5rem;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        background: #f8fafc;
      }
      .admin-card h2 {
        margin-top: 0;
      }
      .admin-actions {
        margin-top: 1.5rem;
      }
      .admin-back {
        display: inline-flex;
        padding: 0.9rem 1.25rem;
        border-radius: 0.85rem;
        background: #2563eb;
        color: white;
        text-decoration: none;
      }
    `
  ]
})
export class AdminComponent {}
