import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CartaoService } from '../../services/cartao.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h2>
          <p class="text-muted">Bem-vindo, {{ currentUser?.nome }}!</p>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-4" *ngIf="isAdmin()">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">Total de Usuários</h6>
                  <h2 class="card-title mb-0">{{ totalUsuarios }}</h2>
                </div>
                <i class="bi bi-people-fill" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0">
              <a routerLink="/usuarios" class="text-white text-decoration-none">
                Ver todos <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>

        <div [class.col-md-4]="isAdmin()" [class.col-md-6]="!isAdmin()">
          <div class="card text-white bg-success">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">{{ isAdmin() ? 'Total de Cartões' : 'Meus Cartões' }}</h6>
                  <h2 class="card-title mb-0">{{ totalCartoes }}</h2>
                </div>
                <i class="bi bi-credit-card-fill" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0">
              <a [routerLink]="isAdmin() ? '/cartoes' : ['/usuarios', currentUser?.id, 'cartoes']" class="text-white text-decoration-none">
                Ver {{ isAdmin() ? 'todos' : 'meus cartões' }} <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>

        <div [class.col-md-4]="isAdmin()" [class.col-md-6]="!isAdmin()">
          <div class="card text-white bg-info">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">{{ isAdmin() ? 'Cartões Ativos' : 'Cartões Ativos' }}</h6>
                  <h2 class="card-title mb-0">{{ cartoesAtivos }}</h2>
                </div>
                <i class="bi bi-check-circle-fill" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0">
              <small>{{ percentualAtivos }}% {{ isAdmin() ? 'dos cartões' : 'dos meus cartões' }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-list-task me-2"></i>
                Ações Rápidas
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <a *ngIf="isAdmin()" routerLink="/usuarios" class="list-group-item list-group-item-action">
                  <i class="bi bi-people me-2 text-primary"></i>
                  Gerenciar Usuários
                </a>
                <a *ngIf="!isAdmin()" [routerLink]="['/usuarios', currentUser?.id, 'editar']" class="list-group-item list-group-item-action">
                  <i class="bi bi-person me-2 text-primary"></i>
                  Meu Perfil
                </a>
                <a routerLink="/usuarios/novo" *ngIf="isAdmin()" class="list-group-item list-group-item-action">
                  <i class="bi bi-person-plus me-2 text-success"></i>
                  Adicionar Novo Usuário
                </a>
                <a *ngIf="isAdmin()" routerLink="/cartoes" class="list-group-item list-group-item-action">
                  <i class="bi bi-credit-card me-2 text-info"></i>
                  Gerenciar Cartões
                </a>
                <a *ngIf="!isAdmin()" [routerLink]="['/usuarios', currentUser?.id, 'cartoes']" class="list-group-item list-group-item-action">
                  <i class="bi bi-credit-card me-2 text-info"></i>
                  Meus Cartões
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Informações do Sistema
              </h5>
            </div>
            <div class="card-body">
              <p><strong>Usuário:</strong> {{ currentUser?.nome }}</p>
              <p><strong>Email:</strong> {{ currentUser?.email }}</p>
              <p><strong>Perfil:</strong> 
                <span class="badge" [class.bg-danger]="isAdmin()" [class.bg-primary]="!isAdmin()">
                  {{ isAdmin() ? 'Administrador' : 'Usuário' }}
                </span>
              </p>
              <p class="mb-0"><strong>Versão:</strong> 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    .card-footer a:hover {
      text-decoration: underline !important;
    }

    .list-group-item {
      border-left: none;
      border-right: none;
      transition: all 0.2s;
    }

    .list-group-item:hover {
      background-color: #f8f9fa;
      padding-left: 1.5rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalUsuarios = 0;
  totalCartoes = 0;
  cartoesAtivos = 0;
  percentualAtivos = 0;

  constructor(
    private usuarioService: UsuarioService,
    private cartaoService: CartaoService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get currentUser() {
    return this.authService.currentUserValue;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    if (this.isAdmin()) {
      // Admin vê estatísticas de todos os usuários
      this.usuarioService.listarTodos().subscribe({
        next: (usuarios) => {
          this.totalUsuarios = usuarios.length;
          this.cdr.detectChanges();
        }
      });

      this.cartaoService.listarTodos().subscribe({
        next: (cartoes) => {
          this.totalCartoes = cartoes.length;
          this.cartoesAtivos = cartoes.filter(c => c.status).length;
          this.percentualAtivos = this.totalCartoes > 0 
            ? Math.round((this.cartoesAtivos / this.totalCartoes) * 100) 
            : 0;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Usuário comum vê apenas seus próprios cartões
      const usuarioId = this.currentUser?.id;
      if (usuarioId) {
        this.cartaoService.listarPorUsuario(usuarioId).subscribe({
          next: (cartoes) => {
            this.totalCartoes = cartoes.length;
            this.cartoesAtivos = cartoes.filter(c => c.status).length;
            this.percentualAtivos = this.totalCartoes > 0 
              ? Math.round((this.cartoesAtivos / this.totalCartoes) * 100) 
              : 0;
            this.cdr.detectChanges();
          }
        });
      }
    }
  }
}
