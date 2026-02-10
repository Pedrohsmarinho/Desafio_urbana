import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CartaoService } from '../../../services/cartao.service';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { Cartao, TipoCartao, Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-cartoes-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="bi bi-credit-card-fill me-2"></i>
            Cartões do Usuário
          </h2>
          <p class="text-muted" *ngIf="usuario">{{ usuario.nome }}</p>
        </div>
        <div class="col-auto">
          <a routerLink="/usuarios" class="btn btn-secondary">
            <i class="bi bi-arrow-left me-2"></i>
            Voltar
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-list me-2"></i>
                Lista de Cartões
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th class="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let cartao of cartoes" class="fade-in">
                      <td><strong>{{ cartao.numeroCartao }}</strong></td>
                      <td>{{ cartao.nome }}</td>
                      <td>
                        <span class="badge" [class]="getBadgeClass(cartao.tipoCartao)">
                          {{ getTipoLabel(cartao.tipoCartao) }}
                        </span>
                      </td>
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
                          <button (click)="removerCartao(cartao)" class="btn btn-outline-danger" title="Remover">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                        <span *ngIf="!isAdmin()" class="text-muted small">Visualização</span>
                      </td>
                    </tr>
                    <tr *ngIf="cartoes.length === 0">
                      <td colspan="5" class="text-center text-muted py-4">
                        <i class="bi bi-inbox display-4 d-block mb-2"></i>
                        Nenhum cartão cadastrado para este usuário
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4" *ngIf="isAdmin()">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-plus-circle me-2"></i>
                Adicionar Cartão
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="cartaoForm" (ngSubmit)="adicionarCartao()">
                <div class="mb-3">
                  <label for="numeroCartao" class="form-label">Número do Cartão *</label>
                  <input
                    type="number"
                    class="form-control"
                    id="numeroCartao"
                    formControlName="numeroCartao"
                    [class.is-invalid]="submitted && f['numeroCartao'].errors"
                    placeholder="1234567890"
                  />
                  <div *ngIf="submitted && f['numeroCartao'].errors" class="invalid-feedback">
                    <div *ngIf="f['numeroCartao'].errors['required']">Número é obrigatório</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="nome" class="form-label">Nome do Cartão *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nome"
                    formControlName="nome"
                    [class.is-invalid]="submitted && f['nome'].errors"
                    placeholder="Cartão Principal"
                  />
                  <div *ngIf="submitted && f['nome'].errors" class="invalid-feedback">
                    <div *ngIf="f['nome'].errors['required']">Nome é obrigatório</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="tipoCartao" class="form-label">Tipo *</label>
                  <select
                    class="form-select"
                    id="tipoCartao"
                    formControlName="tipoCartao"
                    [class.is-invalid]="submitted && f['tipoCartao'].errors"
                  >
                    <option value="">Selecione...</option>
                    <option value="COMUM">Comum</option>
                    <option value="ESTUDANTE">Estudante</option>
                    <option value="TRABALHADOR">Trabalhador</option>
                  </select>
                  <div *ngIf="submitted && f['tipoCartao'].errors" class="invalid-feedback">
                    <div *ngIf="f['tipoCartao'].errors['required']">Tipo é obrigatório</div>
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="error">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="bi bi-plus-circle me-2"></i>
                  {{ loading ? 'Adicionando...' : 'Adicionar Cartão' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table thead {
      background-color: #f8f9fa;
    }
  `]
})
export class CartoesUsuarioComponent implements OnInit {
  cartaoForm: FormGroup;
  cartoes: Cartao[] = [];
  usuario: Usuario | null = null;
  usuarioId: number = 0;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private cartaoService: CartaoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.cartaoForm = this.formBuilder.group({
      numeroCartao: ['', Validators.required],
      nome: ['', Validators.required],
      tipoCartao: ['', Validators.required],
      status: [true]
    });
  }

  get f() {
    return this.cartaoForm.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      this.carregarUsuario();
      this.carregarCartoes();
    });
  }

  carregarUsuario(): void {
    this.usuarioService.buscarPorId(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.router.navigate(['/usuarios']);
      }
    });
  }

  carregarCartoes(): void {
    this.cartaoService.listarPorUsuario(this.usuarioId).subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar cartões:', error);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
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

  adicionarCartao(): void {
    this.submitted = true;
    this.error = '';

    if (this.cartaoForm.invalid) {
      return;
    }

    this.loading = true;

    this.cartaoService.adicionarCartaoAoUsuario(this.usuarioId, this.cartaoForm.value).subscribe({
      next: () => {
        this.cartaoForm.reset({ status: true });
        this.submitted = false;
        this.loading = false;
        this.carregarCartoes();
      },
      error: (error) => {
        this.error = error.message || 'Erro ao adicionar cartão.';
        this.loading = false;
      }
    });
  }

  toggleStatus(cartao: Cartao): void {
    if (cartao.id) {
      this.cartaoService.ativarOuDesativar(cartao.id, !cartao.status).subscribe({
        next: () => {
          this.carregarCartoes();
        },
        error: (error) => {
          alert('Erro ao alterar status: ' + error.message);
        }
      });
    }
  }

  removerCartao(cartao: Cartao): void {
    if (confirm(`Deseja realmente remover o cartão ${cartao.nome}?`)) {
      if (cartao.id) {
        this.cartaoService.removerCartaoDoUsuario(this.usuarioId, cartao.id).subscribe({
          next: () => {
            this.carregarCartoes();
          },
          error: (error) => {
            alert('Erro ao remover cartão: ' + error.message);
          }
        });
      }
    }
  }
}
