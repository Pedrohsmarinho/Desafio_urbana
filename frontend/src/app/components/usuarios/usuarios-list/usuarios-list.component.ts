import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="bi" [class.bi-people-fill]="isAdmin()" [class.bi-person-circle]="!isAdmin()" class="me-2"></i>
            {{ isAdmin() ? 'Usuários' : 'Meu Perfil' }}
          </h2>
          <p class="text-muted">{{ isAdmin() ? 'Gerenciamento de usuários do sistema' : 'Informações da minha conta' }}</p>
        </div>
        <div class="col-auto" *ngIf="isAdmin()">
          <a routerLink="/usuarios/novo" class="btn btn-primary">
            <i class="bi bi-person-plus me-2"></i>
            Novo Usuário
          </a>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row mb-3" *ngIf="isAdmin()">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar por nome ou email..."
                  [(ngModel)]="filtro"
                  (ngModelChange)="filtrarUsuarios()"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check" name="status" id="todos" value="todos" [(ngModel)]="statusFiltro" (change)="aplicarFiltros()" checked>
                <label class="btn btn-outline-primary" for="todos">Todos</label>

                <input type="radio" class="btn-check" name="status" id="ativos" value="ativos" [(ngModel)]="statusFiltro" (change)="aplicarFiltros()">
                <label class="btn btn-outline-success" for="ativos">Ativos</label>

                <input type="radio" class="btn-check" name="status" id="inativos" value="inativos" [(ngModel)]="statusFiltro" (change)="aplicarFiltros()">
                <label class="btn btn-outline-secondary" for="inativos">Inativos</label>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Cartões</th>
                  <th class="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of usuariosFiltrados" class="fade-in">
                  <td>{{ usuario.id }}</td>
                  <td>
                    <i class="bi bi-person-circle me-2 text-primary"></i>
                    {{ usuario.nome }}
                  </td>
                  <td>{{ usuario.email }}</td>
                  <td>
                    <span class="badge" [class.bg-danger]="usuario.role === 'ROLE_ADMIN'" [class.bg-primary]="usuario.role !== 'ROLE_ADMIN'">
                      {{ usuario.role === 'ROLE_ADMIN' ? 'Admin' : 'Usuário' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [class.bg-success]="usuario.ativo" [class.bg-secondary]="!usuario.ativo">
                      {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-info">
                      {{ usuario.cartoes?.length || 0 }} cartão(ões)
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <a [routerLink]="['/usuarios', usuario.id, 'cartoes']" class="btn btn-outline-info" title="Ver Cartões">
                        <i class="bi bi-credit-card"></i>
                      </a>
                      <a *ngIf="podeEditar(usuario)" [routerLink]="['/usuarios', usuario.id, 'editar']" class="btn btn-outline-warning" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </a>
                      <button *ngIf="podeEditar(usuario)" (click)="confirmarExclusao(usuario)" class="btn btn-outline-danger" title="Excluir">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="usuariosFiltrados.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">
                    <i class="bi bi-inbox display-4 d-block mb-2"></i>
                    Nenhum usuário encontrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div class="modal fade" [class.show]="mostrarModal" [style.display]="mostrarModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" (click)="fecharModal()"></button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja excluir o usuário <strong>{{ usuarioSelecionado?.nome }}</strong>?</p>
            <p class="text-muted small">O usuário será inativado no sistema.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="excluirUsuario()">
              <i class="bi bi-trash me-2"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="mostrarModal" *ngIf="mostrarModal"></div>
  `,
  styles: [`
    .table thead {
      background-color: #f8f9fa;
    }

    .table tbody tr {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }

    .modal.show {
      display: block;
    }

    .modal-backdrop.show {
      opacity: 0.5;
    }
  `]
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  filtro = '';
  statusFiltro = 'todos';
  mostrarModal = false;
  usuarioSelecionado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  podeEditar(usuario: Usuario): boolean {
    // Admin pode editar qualquer usuário
    if (this.isAdmin()) {
      return true;
    }
    // Usuário comum só pode editar a si mesmo
    return this.authService.currentUserValue?.id === usuario.id;
  }

  carregarUsuarios(): void {
    if (this.isAdmin()) {
      // Admin vê todos os usuários
      this.usuarioService.listarTodos().subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.aplicarFiltros();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
        }
      });
    } else {
      // Usuário comum vê apenas seu próprio perfil
      const usuarioId = this.authService.currentUserValue?.id;
      if (usuarioId) {
        this.usuarioService.buscarPorId(usuarioId).subscribe({
          next: (usuario) => {
            this.usuarios = [usuario];
            this.aplicarFiltros();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao carregar usuário:', error);
          }
        });
      }
    }
  }

  filtrarUsuarios(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.usuarios];

    // Filtro por status
    if (this.statusFiltro === 'ativos') {
      resultado = resultado.filter(u => u.ativo);
    } else if (this.statusFiltro === 'inativos') {
      resultado = resultado.filter(u => !u.ativo);
    }

    // Filtro por texto
    if (this.filtro.trim()) {
      const termo = this.filtro.toLowerCase();
      resultado = resultado.filter(u =>
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo)
      );
    }

    this.usuariosFiltrados = resultado;
  }

  confirmarExclusao(usuario: Usuario): void {
    this.usuarioSelecionado = usuario;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.usuarioSelecionado = null;
  }

  excluirUsuario(): void {
    if (this.usuarioSelecionado?.id) {
      this.usuarioService.deletar(this.usuarioSelecionado.id).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarUsuarios();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          alert('Erro ao excluir usuário: ' + error.message);
        }
      });
    }
  }
}
