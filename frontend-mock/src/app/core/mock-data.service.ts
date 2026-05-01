import { Injectable, signal } from '@angular/core';
import { Product, Order, OrderStatus, OrderItem } from './models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  // Mock Products
  products = signal<Product[]>([
    { id: 1, name: 'Hambúrguer Clássico', description: 'Pão brioche, carne 180g, queijo cheddar e bacon.', price: 35.90, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
    { id: 2, name: 'Pizza Margherita', description: 'Massa fina, molho de tomate fresco, mussarela e manjericão.', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&q=80' },
    { id: 3, name: 'Sushi Combo', description: '12 peças de salmão, atum e peixe branco.', price: 65.50, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
    { id: 4, name: 'Salada Fit', description: 'Mix de folhas, frango grelhado, tomate cereja e molho mostarda.', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' }
  ]);

  // Mock Orders State (Shared between Client and Restaurant)
  orders = signal<Order[]>([]);

  // Cart State (Client side)
  cart = signal<OrderItem[]>([]);

  constructor() {
    // Add some initial mock orders for the restaurant dashboard
    this.addMockOrder('123', 'CONFIRMADO');
    this.addMockOrder('124', 'EM_PREPARO');
    this.addMockOrder('125', 'PRONTO');
  }

  addToCart(product: Product) {
    const current = this.cart();
    const existing = current.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
      this.cart.set([...current]);
    } else {
      this.cart.set([...current, { product, quantity: 1 }]);
    }
  }

  get cartTotal(): number {
    return this.cart().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  checkout(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrderId = Math.random().toString(36).substring(7).toUpperCase();
        const newOrder: Order = {
          id: newOrderId,
          items: [...this.cart()],
          total: this.cartTotal,
          status: 'CRIADO',
          createdAt: new Date()
        };
        this.orders.update(orders => [...orders, newOrder]);
        this.cart.set([]); // Clear cart
        
        // Simulate payment webhook updating status to CONFIRMADO after 3 seconds
        setTimeout(() => this.updateOrderStatus(newOrderId, 'CONFIRMADO'), 3000);
        
        resolve(newOrderId);
      }, 1500); // Simulate network delay
    });
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.orders.update(orders => {
      const order = orders.find(o => o.id === orderId);
      if (order) order.status = status;
      return [...orders];
    });
  }

  private addMockOrder(id: string, status: OrderStatus) {
    this.orders.update(orders => [...orders, {
      id,
      items: [{ product: this.products()[0], quantity: 2 }],
      total: 71.80,
      status,
      createdAt: new Date()
    }]);
  }
}
