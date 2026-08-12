import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="checkout-page">
      <section class="checkout-shell">
        <div class="checkout-header">
          <div>
            <h1>Finalizar Pedido</h1>
            <p>Revise os itens do carrinho e preencha seus dados para concluir a compra.</p>
          </div>
          <button routerLink="/" class="back-link">← Voltar à loja</button>
        </div>

        <div class="checkout-content">
          <section class="order-summary" *ngIf="items().length; else emptyCart">
            <h2>Resumo do pedido</h2>
            <ul>
              <li *ngFor="let item of items()">
                <div>
                  <strong>{{ item.product.title }}</strong>
                  <p>{{ item.quantity }} x R$ {{ item.product.price | number:'1.2-2' }}</p>
                </div>
                <span>R$ {{ (item.product.price * item.quantity) | number:'1.2-2' }}</span>
              </li>
            </ul>
            <div class="order-total">
              <span>Total</span>
              <strong>R$ {{ totalPrice() | number:'1.2-2' }}</strong>
            </div>
            <div class="order-total" *ngIf="cartService.discount() > 0">
              <span>Desconto</span>
              <strong>- R$ {{ cartService.discount() | number:'1.2-2' }}</strong>
            </div>
            <div class="order-total total-after">
              <span>Total com desconto</span>
              <strong>R$ {{ cartService.totalAfterDiscount() | number:'1.2-2' }}</strong>
            </div>
          </section>

          <aside class="checkout-form-card" *ngIf="items().length; else emptyCart">
            <h2>Informações do pedido</h2>
            <form #checkoutForm="ngForm" (ngSubmit)="submitOrder(checkoutForm)">
              <label>
                Nome completo
                <input
                  name="name"
                  required
                  minlength="3"
                  ngModel
                  [class.invalid]="submitted() && !checkoutForm.controls['name']?.valid"
                />
                <small class="field-error" *ngIf="submitted() && checkoutForm.controls['name']?.invalid">
                  Informe seu nome completo.
                </small>
              </label>

              <label>
                CPF
                <input
                  name="cpf"
                  required
                  pattern="^[0-9]{11}$"
                  ngModel
                  [class.invalid]="submitted() && !checkoutForm.controls['cpf']?.valid"
                  placeholder="Somente números"
                />
                <small class="field-error" *ngIf="submitted() && checkoutForm.controls['cpf']?.invalid">
                  CPF inválido. Use 11 dígitos numéricos.
                </small>
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  required
                  ngModel
                  [class.invalid]="submitted() && !checkoutForm.controls['email']?.valid"
                />
                <small class="field-error" *ngIf="submitted() && checkoutForm.controls['email']?.invalid">
                  Insira um e-mail válido.
                </small>
              </label>

              <label>
                Endereço de entrega
                <textarea
                  name="address"
                  required
                  minlength="10"
                  ngModel
                  [class.invalid]="submitted() && !checkoutForm.controls['address']?.valid"
                ></textarea>
                <small class="field-error" *ngIf="submitted() && checkoutForm.controls['address']?.invalid">
                  Informe o endereço completo com rua, número e cidade.
                </small>
              </label>

              <label>
                Método de pagamento
                <select
                  name="paymentMethod"
                  required
                  ngModel
                  [class.invalid]="submitted() && !checkoutForm.controls['paymentMethod']?.valid"
                >
                  <option value="">Selecione</option>
                  <option value="credit-card">Cartão de crédito</option>
                  <option value="debit-card">Cartão de débito</option>
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto</option>
                </select>
                <small class="field-error" *ngIf="submitted() && checkoutForm.controls['paymentMethod']?.invalid">
                  Escolha uma forma de pagamento.
                </small>
              </label>

              <button type="submit" class="submit-button" [disabled]="orderCompleted()">{{ orderCompleted() ? 'Pedido confirmado' : 'Confirmar pedido' }}</button>
              <p class="form-message" *ngIf="submitted() && checkoutForm.invalid">Preencha todos os campos corretamente para continuar.</p>
            </form>
            <p class="success-message" *ngIf="checkoutMessage()">{{ checkoutMessage() }}</p>
          </aside>
        </div>

        <ng-template #emptyCart>
          <div class="empty-state">
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione um livro ao carrinho antes de finalizar a compra.</p>
            <button routerLink="/" class="shop-button">Voltar à loja</button>
          </div>
        </ng-template>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .checkout-page {
        min-height: 100vh;
        background: #f8fafc;
        padding: 2rem 1rem;
      }

      .checkout-shell {
        max-width: 1120px;
        margin: 0 auto;
        display: grid;
        gap: 1.5rem;
      }

      .checkout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .checkout-header h1 {
        margin: 0;
        font-size: 2rem;
      }

      .checkout-header p {
        margin: 0.5rem 0 0;
        color: #475569;
      }

      .back-link,
      .shop-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: #2563eb;
        color: white;
        border-radius: 0.9rem;
        padding: 0.85rem 1.2rem;
        text-decoration: none;
        cursor: pointer;
      }

      .checkout-content {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
        gap: 1.5rem;
      }

      .order-summary,
      .checkout-form-card,
      .empty-state {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
        min-width: 0;
        overflow: hidden;
      }

      .order-summary h2,
      .checkout-form-card h2 {
        margin: 0 0 1rem;
        font-size: 1.25rem;
      }

      .order-summary ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
      }

      .order-summary li {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 1rem;
      }

      .order-summary li:last-child {
        border-bottom: none;
      }

      .order-total {
        display: flex;
        justify-content: space-between;
        margin-top: 1.5rem;
        font-size: 1.1rem;
      }

      .checkout-form-card form {
        display: grid;
        gap: 1rem;
        min-width: 0;
      }

      label {
        display: grid;
        gap: 0.5rem;
        min-width: 0;
        font-weight: 600;
        color: #0f172a;
      }

      input,
      textarea,
      select {
        display: block;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: 0.9rem 1rem;
        border-radius: 0.85rem;
        border: 1px solid #cbd5e1;
        font-size: 1rem;
        outline: none;
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }

      .invalid {
        border-color: #ef4444;
      }

      .submit-button {
        border: none;
        background: #10b981;
        color: white;
        border-radius: 0.85rem;
        padding: 1rem 1.2rem;
        font-weight: 700;
        cursor: pointer;
      }
      .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .form-message,
      .success-message {
        margin: 0;
        font-size: 0.95rem;
      }

      .form-message {
        color: #dc2626;
      }

      .success-message {
        color: #047857;
        font-weight: 700;
      }

      .empty-state {
        text-align: center;
      }

      .empty-state h2 {
        margin-top: 0;
        font-size: 1.5rem;
      }

      .empty-state p {
        color: #475569;
      }

      @media (max-width: 980px) {
        .checkout-content {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .checkout-page {
          padding: 1rem 0.75rem;
        }
        .checkout-header,
        .order-summary li,
        .order-total {
          display: grid;
          align-items: start;
        }
        .back-link,
        .shop-button,
        .submit-button {
          width: 100%;
        }
        .order-summary,
        .checkout-form-card,
        .empty-state {
          width: 100%;
          padding: 1rem;
        }
      }
    `
  ]
})
export class CheckoutComponent {
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly items = this.cartService.items;
  readonly totalPrice = this.cartService.totalPrice;
  readonly checkoutMessage = signal('');
  readonly submitted = signal(false);
  readonly orderCompleted = signal(false);

  submitOrder(form: NgForm) {
    this.submitted.set(true);

    if (!this.items().length || this.orderCompleted()) {
      return;
    }

    if (!form.valid) {
      return;
    }

    const paymentMethod = form.value.paymentMethod;
    const name = form.value.name?.trim();
    const cpf = form.value.cpf?.trim();
    const email = form.value.email?.trim();
    const address = form.value.address?.trim();

    const cpfValid = /^[0-9]{11}$/.test(cpf);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !cpfValid || !emailValid || !address || !paymentMethod) {
      return;
    }

    this.orderCompleted.set(true);
    this.submitted.set(false);
    this.checkoutMessage.set(
      `Pedido emitido com sucesso! Obrigado, ${name}. Metodo de pagamento: ${this.paymentDescription(paymentMethod)}.`
    );
    form.resetForm();

    setTimeout(() => {
      this.cartService.clear();
      this.checkoutMessage.set('');
      this.orderCompleted.set(false);
      this.router.navigate(['/']);
    }, 4500);
  }

  paymentDescription(method: string): string {
    const descriptions: Record<string, string> = {
      'credit-card': 'Cartão de crédito',
      'debit-card': 'Cartão de débito',
      pix: 'PIX',
      boleto: 'Boleto'
    };
    return descriptions[method] ?? 'Método selecionado';
  }
}



