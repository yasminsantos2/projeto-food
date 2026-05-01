export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'CRIADO' | 'CONFIRMADO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
