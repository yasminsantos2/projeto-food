import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div *ngIf="router.url === '/'" class="landing-page">
      <div class="glass-card">
        <div class="logo">🍔</div>
        <h1>Alura Food</h1>
        <p>Escolha qual interface deseja testar:</p>
        
        <div class="actions">
          <a routerLink="/cliente" class="btn btn-customer">
            📱 App do Cliente
            <small>Fazer Pedidos e Checkout</small>
          </a>
          
          <a routerLink="/restaurante" class="btn btn-admin">
            💻 Painel do Restaurante
            <small>Kanban e Gestão</small>
          </a>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .landing-page { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ea1d2c 0%, #ff4b2b 100%); font-family: 'Inter', sans-serif; }
    .glass-card { background: rgba(255, 255, 255, 0.95); padding: 3rem; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 500px; width: 100%; }
    .logo { font-size: 4rem; margin-bottom: 1rem; }
    h1 { color: #333; margin-top: 0; font-size: 2.5rem; }
    p { color: #666; margin-bottom: 2rem; font-size: 1.1rem; }
    .actions { display: flex; flex-direction: column; gap: 1rem; }
    .btn { display: flex; flex-direction: column; align-items: center; padding: 1.5rem; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 1.2rem; transition: transform 0.2s, box-shadow 0.2s; }
    .btn small { font-size: 0.85rem; font-weight: normal; margin-top: 5px; opacity: 0.9; }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    .btn-customer { background: #ea1d2c; color: white; }
    .btn-admin { background: #1a1a2e; color: white; }
  `]
})
export class AppComponent {
  router = inject(Router);
}
