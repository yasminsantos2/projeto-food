import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/mock-data.service';
import { Product, Order } from '../../core/models';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cliente-container">
      <!-- Header -->
      <header class="glass-header">
        <h1>Alura Food</h1>
        <div class="cart-icon" (click)="toggleCart()">
          🛒 <span class="badge">{{ cartItemCount() }}</span>
        </div>
      </header>

      <!-- Current Order Tracking -->
      <div *ngIf="currentOrder()" class="tracking-banner">
        <h3>Pedido #{{ currentOrder()?.id }}</h3>
        <div class="stepper">
          <div class="step" [class.active]="currentOrder()?.status === 'CRIADO' || currentOrder()?.status === 'CONFIRMADO' || currentOrder()?.status === 'EM_PREPARO' || currentOrder()?.status === 'PRONTO' || currentOrder()?.status === 'ENTREGUE'">1. Criado</div>
          <div class="step" [class.active]="currentOrder()?.status === 'CONFIRMADO' || currentOrder()?.status === 'EM_PREPARO' || currentOrder()?.status === 'PRONTO' || currentOrder()?.status === 'ENTREGUE'">2. Pago</div>
          <div class="step" [class.active]="currentOrder()?.status === 'EM_PREPARO' || currentOrder()?.status === 'PRONTO' || currentOrder()?.status === 'ENTREGUE'">3. Preparando</div>
          <div class="step" [class.active]="currentOrder()?.status === 'PRONTO' || currentOrder()?.status === 'ENTREGUE'">4. Pronto</div>
        </div>
      </div>

      <!-- Catalog -->
      <main class="catalog">
        <h2>Cardápio</h2>
        <div class="product-grid">
          <div *ngFor="let p of products()" class="product-card">
            <img [src]="p.imageUrl" [alt]="p.name">
            <div class="card-content">
              <h3>{{ p.name }}</h3>
              <p>{{ p.description }}</p>
              <div class="card-footer">
                <span class="price">{{ p.price | currency:'BRL' }}</span>
                <button class="btn-primary" (click)="addToCart(p)">+ Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Cart Drawer -->
      <div class="cart-overlay" *ngIf="isCartOpen()" (click)="toggleCart()"></div>
      <aside class="cart-drawer" [class.open]="isCartOpen()">
        <div class="cart-header">
          <h2>Seu Pedido</h2>
          <button class="close-btn" (click)="toggleCart()">✖</button>
        </div>
        
        <div class="cart-items" *ngIf="cart().length > 0; else emptyCart">
          <div class="cart-item" *ngFor="let item of cart()">
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <span class="qty">Qtd: {{ item.quantity }}</span>
            </div>
            <span class="item-price">{{ (item.product.price * item.quantity) | currency:'BRL' }}</span>
          </div>
        </div>
        <ng-template #emptyCart>
          <p class="empty-msg">Seu carrinho está vazio.</p>
        </ng-template>

        <div class="cart-footer" *ngIf="cart().length > 0">
          <div class="total">
            <span>Total:</span>
            <span>{{ cartTotal() | currency:'BRL' }}</span>
          </div>
          <button class="btn-checkout" [disabled]="isProcessing()" (click)="doCheckout()">
            {{ isProcessing() ? 'Processando Pagamento...' : 'Finalizar Pedido' }}
          </button>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .cliente-container { padding-top: 80px; min-height: 100vh; background: #f8f9fa; }
    .glass-header { 
      position: fixed; top: 0; left: 0; right: 0; height: 70px; 
      background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); z-index: 100;
    }
    .glass-header h1 { color: #ea1d2c; margin: 0; font-size: 1.5rem; }
    .cart-icon { font-size: 1.5rem; cursor: pointer; position: relative; }
    .badge { position: absolute; top: -5px; right: -10px; background: #ea1d2c; color: white; border-radius: 50%; font-size: 0.8rem; padding: 2px 6px; }
    
    .tracking-banner { background: #fff; margin: 1rem 2rem; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .tracking-banner h3 { color: #ea1d2c; margin-top: 0; }
    .stepper { display: flex; justify-content: space-between; margin-top: 1rem; }
    .step { flex: 1; text-align: center; padding: 10px; border-bottom: 3px solid #eee; color: #aaa; transition: 0.3s; }
    .step.active { border-bottom-color: #ea1d2c; color: #ea1d2c; font-weight: bold; }

    .catalog { padding: 2rem; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; margin-top: 1rem; }
    .product-card { 
      background: white; border-radius: 16px; overflow: hidden; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s;
    }
    .product-card:hover { transform: translateY(-5px); }
    .product-card img { width: 100%; height: 180px; object-fit: cover; }
    .card-content { padding: 1.5rem; }
    .card-content h3 { margin: 0 0 0.5rem 0; font-size: 1.2rem; }
    .card-content p { color: #666; font-size: 0.9rem; min-height: 40px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
    .price { font-weight: bold; font-size: 1.2rem; color: #333; }
    .btn-primary { background: #ea1d2c; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s; }
    .btn-primary:hover { background: #c81926; }

    .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 101; }
    .cart-drawer { 
      position: fixed; top: 0; right: -400px; bottom: 0; width: 100%; max-width: 400px;
      background: white; z-index: 102; transition: right 0.3s ease;
      display: flex; flex-direction: column; box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    }
    .cart-drawer.open { right: 0; }
    .cart-header { display: flex; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #eee; }
    .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; }
    .cart-items { flex: 1; overflow-y: auto; padding: 1.5rem; }
    .cart-item { display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f5f5f5; }
    .item-info h4 { margin: 0 0 0.5rem 0; }
    .qty { color: #666; font-size: 0.9rem; }
    .item-price { font-weight: bold; }
    .cart-footer { padding: 1.5rem; border-top: 1px solid #eee; background: #fafafa; }
    .total { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
    .btn-checkout { width: 100%; padding: 15px; background: #ea1d2c; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
    .btn-checkout:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class ClienteComponent {
  dataService = inject(MockDataService);
  
  products = this.dataService.products;
  cart = this.dataService.cart;
  cartItemCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));
  cartTotal = computed(() => this.dataService.cartTotal);
  
  isCartOpen = signal(false);
  isProcessing = signal(false);
  currentOrderId = signal<string | null>(null);

  currentOrder = computed(() => {
    const id = this.currentOrderId();
    if (!id) return null;
    return this.dataService.orders().find(o => o.id === id);
  });

  toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
  }

  addToCart(product: Product) {
    this.dataService.addToCart(product);
  }

  async doCheckout() {
    this.isProcessing.set(true);
    const orderId = await this.dataService.checkout();
    this.currentOrderId.set(orderId);
    this.isProcessing.set(false);
    this.isCartOpen.set(false);
  }
}
