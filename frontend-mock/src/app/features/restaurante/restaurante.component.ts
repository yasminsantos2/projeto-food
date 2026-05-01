import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/mock-data.service';
import { Order, OrderStatus } from '../../core/models';

@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="restaurante-container">
      <header class="admin-header">
        <h1>Painel da Cozinha - Alura Food</h1>
        <div class="stats">
          <span>Total Pedidos: {{ orders().length }}</span>
        </div>
      </header>

      <main class="kanban-board">
        <!-- Coluna: Novos -->
        <div class="kanban-column" (dragover)="allowDrop($event)" (drop)="onDrop($event, 'CONFIRMADO')">
          <div class="column-header">
            <h2>Novos / Pagos</h2>
            <span class="count">{{ getOrdersByStatus('CONFIRMADO').length }}</span>
          </div>
          <div class="kanban-cards">
            <div class="k-card" *ngFor="let order of getOrdersByStatus('CRIADO').concat(getOrdersByStatus('CONFIRMADO'))"
                 draggable="true" (dragstart)="onDragStart($event, order)">
              <div class="k-header">
                <span class="order-id">#{{ order.id }}</span>
                <span class="time">{{ order.createdAt | date:'HH:mm' }}</span>
              </div>
              <ul class="k-items">
                <li *ngFor="let item of order.items">{{ item.quantity }}x {{ item.product.name }}</li>
              </ul>
              <div class="k-footer">
                <button class="btn-action" (click)="updateStatus(order.id, 'EM_PREPARO')">Preparar ➔</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna: Em Preparo -->
        <div class="kanban-column" (dragover)="allowDrop($event)" (drop)="onDrop($event, 'EM_PREPARO')">
          <div class="column-header">
            <h2>Na Cozinha</h2>
            <span class="count">{{ getOrdersByStatus('EM_PREPARO').length }}</span>
          </div>
          <div class="kanban-cards">
            <div class="k-card preparing" *ngFor="let order of getOrdersByStatus('EM_PREPARO')"
                 draggable="true" (dragstart)="onDragStart($event, order)">
              <div class="k-header">
                <span class="order-id">#{{ order.id }}</span>
                <span class="time">{{ order.createdAt | date:'HH:mm' }}</span>
              </div>
              <ul class="k-items">
                <li *ngFor="let item of order.items">{{ item.quantity }}x {{ item.product.name }}</li>
              </ul>
              <div class="k-footer">
                <button class="btn-action success" (click)="updateStatus(order.id, 'PRONTO')">Pronto ➔</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna: Pronto -->
        <div class="kanban-column" (dragover)="allowDrop($event)" (drop)="onDrop($event, 'PRONTO')">
          <div class="column-header">
            <h2>Pronto para Entrega</h2>
            <span class="count">{{ getOrdersByStatus('PRONTO').length }}</span>
          </div>
          <div class="kanban-cards">
            <div class="k-card ready" *ngFor="let order of getOrdersByStatus('PRONTO')"
                 draggable="true" (dragstart)="onDragStart($event, order)">
              <div class="k-header">
                <span class="order-id">#{{ order.id }}</span>
                <span class="time">{{ order.createdAt | date:'HH:mm' }}</span>
              </div>
              <ul class="k-items">
                <li *ngFor="let item of order.items">{{ item.quantity }}x {{ item.product.name }}</li>
              </ul>
              <div class="k-footer">
                <button class="btn-action outline" (click)="updateStatus(order.id, 'ENTREGUE')">Entregar ➔</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .restaurante-container { min-height: 100vh; background: #f0f2f5; font-family: 'Inter', sans-serif; }
    .admin-header { background: #1a1a2e; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .admin-header h1 { margin: 0; font-size: 1.5rem; }
    
    .kanban-board { display: flex; gap: 2rem; padding: 2rem; overflow-x: auto; height: calc(100vh - 70px); }
    .kanban-column { flex: 1; min-width: 320px; background: #e2e4e9; border-radius: 12px; display: flex; flex-direction: column; }
    .column-header { padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(0,0,0,0.05); }
    .column-header h2 { margin: 0; font-size: 1.1rem; color: #333; }
    .count { background: rgba(0,0,0,0.1); padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; }
    
    .kanban-cards { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
    .k-card { background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: grab; transition: transform 0.2s, box-shadow 0.2s; border-left: 4px solid #ea1d2c; }
    .k-card:active { cursor: grabbing; transform: scale(0.98); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    .k-card.preparing { border-left-color: #f39c12; }
    .k-card.ready { border-left-color: #27ae60; }
    
    .k-header { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #666; font-size: 0.9rem; }
    .order-id { font-weight: bold; color: #333; font-size: 1rem; }
    .k-items { list-style: none; padding: 0; margin: 0 0 1rem 0; font-size: 0.95rem; color: #444; }
    .k-items li { margin-bottom: 4px; }
    
    .k-footer { text-align: right; }
    .btn-action { background: #ea1d2c; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: bold; }
    .btn-action.success { background: #27ae60; }
    .btn-action.outline { background: transparent; color: #666; border: 1px solid #ccc; }
    .btn-action:hover { opacity: 0.9; }
  `]
})
export class RestauranteComponent {
  dataService = inject(MockDataService);
  orders = this.dataService.orders;

  getOrdersByStatus(status: OrderStatus) {
    return this.orders().filter(o => o.status === status);
  }

  updateStatus(orderId: string, status: OrderStatus) {
    this.dataService.updateOrderStatus(orderId, status);
  }

  // Drag and Drop Logic
  onDragStart(event: DragEvent, order: Order) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('orderId', order.id);
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault(); // Necessário para permitir o drop
  }

  onDrop(event: DragEvent, newStatus: OrderStatus) {
    event.preventDefault();
    if (event.dataTransfer) {
      const orderId = event.dataTransfer.getData('orderId');
      if (orderId) {
        this.updateStatus(orderId, newStatus);
      }
    }
  }
}
