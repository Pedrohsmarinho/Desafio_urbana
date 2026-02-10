import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartaoService } from '../../../services/cartao.service';
import { AuthService } from '../../../services/auth.service';
import { Cartao, TipoCartao } from '../../../models/usuario.model';

@Component({
  selector: 'app-cartoes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="bi bi-credit-card-fill me-2"></i>
            {{ isAdmin() ? 'Cartões' : 'Meus Cartões' }}
          </h2>
          <p class="text-muted">{{ isAdmin() ? 'Gerenciamento de cartões de ônibus' : 'Visualização dos meus cartões' }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar por número, nome ou usuário..."
                  [(ngModel)]="filtro"
                  (ngModelChange)="filtrarCartoes()"
                />
              </div>
            </div>
            <div class="col-md-6">
              <select class="form-select" [(ngModel)]="tipoFiltro" (change)="aplicarFiltros()">
                <option value="">Todos os tipos</option>
                <option value="COMUM">Comum</option>
                <option value="ESTUDANTE">Estudante</option>
                <option value="TRABALHADOR">Trabalhador</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th class="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cartao of cartoesFiltrados" class="fade-in">
                  <td>
                    <strong>{{ cartao.numeroCartao }}</strong>
                  </td>
                  <td>
                    <i class="bi bi-credit-card me-2 text-info"></i>
                    {{ cartao.nome }}
                  </td>
                  <td>
                    <span class="badge" [class]="getBadgeClass(cartao.tipoCartao)">
                      {{ getTipoLabel(cartao.tipoCartao) }}
                    </span>
                  </td>
                  <td>{{ cartao.usuarioNome }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="cartao.status" [class.bg-secondary]="!cartao.status">
                      {{ cartao.status ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm" *ngIf="isAdmin()">
                      <button
                        (click)="toggleStatus(cartao)"
                        class="btn"
                        [class.btn-outline-success]="!cartao.status"
                        [class.btn-outline-secondary]="cartao.status"
                        [title]="cartao.status ? 'Desativar' : 'Ativar'"
                      >
                        <i class="bi" [class.bi-check-circle]="!cartao.status" [class.bi-x-circle]="cartao.status"></i>
                      </button>
                      <button (click)="confirmarExclusao(cartao)" class="btn btn-outline-danger" title="Excluir">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <span *ngIf="!isAdmin()" class="text-muted small">Sem permissão</span>
                  </td>
                </tr>
                <tr *ngIf="cartoesFiltrados.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    <i class="bi bi-inbox display-4 d-block mb-2"></i>
                    Nenhum cartão encontrado
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
            <p>Tem certeza que deseja excluir o cartão <strong>{{ cartaoSelecionado?.nome }}</strong>?</p>
            <p class="text-muted small">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="excluirCartao()">
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

    .modal.show {
      display: block;
    }

    .modal-backdrop.show {
      opacity: 0.5;
    }
  `]
})
export class CartoesListComponent implements OnInit {
  cartoes: Cartao[] = [];
  cartoesFiltrados: Cartao[] = [];
  filtro = '';
  tipoFiltro = '';
  mostrarModal = false;
  cartaoSelecionado: Cartao | null = null;

  constructor(
    private cartaoService: CartaoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarCartoes();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  carregarCartoes(): void {
    if (this.isAdmin()) {
      // Admin vê todos os cartões
      this.cartaoService.listarTodos().subscribe({
        next: (cartoes) => {
          this.cartoes = cartoes;
          this.aplicarFiltros();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar cartões:', error);
        }
      });
    } else {
      // Usuário comum vê apenas seus cartões
      const usuarioId = this.authService.currentUserValue?.id;
      if (usuarioId) {
        this.cartaoService.listarPorUsuario(usuarioId).subscribe({
          next: (cartoes) => {
            this.cartoes = cartoes;
            this.aplicarFiltros();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao carregar cartões:', error);
          }
        });
      }
    }
  }

  filtrarCartoes(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.cartoes];

    // Filtro por tipo
    if (this.tipoFiltro) {
      resultado = resultado.filter(c => c.tipoCartao === this.tipoFiltro);
    }

    // Filtro por texto
    if (this.filtro.trim()) {
      const termo = this.filtro.toLowerCase();
      resultado = resultado.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        c.numeroCartao.toString().includes(termo) ||
        c.usuarioNome?.toLowerCase().includes(termo)
      );
    }

    this.cartoesFiltrados = resultado;
  }

  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'COMUM': 'Comum',
      'ESTUDANTE': 'Estudante',
      'TRABALHADOR': 'Trabalhador'
    };
    return labels[tipo] || tipo;
  }

  getBadgeClass(tipo: string): string {
    const classes: { [key: string]: string } = {
      'COMUM': 'bg-primary',
      'ESTUDANTE': 'bg-warning',
      'TRABALHADOR': 'bg-info'
    };
    return classes[tipo] || 'bg-secondary';
  }

  toggleStatus(cartao: Cartao): void {
    if (cartao.id) {
      this.cartaoService.ativarOuDesativar(cartao.id, !cartao.status).subscribe({
        next: () => {
          this.carregarCartoes();
        },
        error: (error) => {
          console.error('Erro ao alterar status:', error);
          alert('Erro ao alterar status: ' + error.message);
        }
      });
    }
  }

  confirmarExclusao(cartao: Cartao): void {
    this.cartaoSelecionado = cartao;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.cartaoSelecionado = null;
  }

  excluirCartao(): void {
    if (this.cartaoSelecionado?.id) {
      this.cartaoService.deletar(this.cartaoSelecionado.id).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarCartoes();
        },
        error: (error) => {
          console.error('Erro ao excluir cartão:', error);
          alert('Erro ao excluir cartão: ' + error.message);
        }
      });
    }
  }
}
