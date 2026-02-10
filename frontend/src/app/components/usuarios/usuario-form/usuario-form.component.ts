import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="bi" [class.bi-person-plus]="!isEditMode" [class.bi-pencil]="isEditMode" class="me-2"></i>
            {{ isEditMode ? 'Editar Usuário' : 'Novo Usuário' }}
          </h2>
          <p class="text-muted">Preencha os dados do usuário</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome Completo *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nome"
                    formControlName="nome"
                    [class.is-invalid]="submitted && f['nome'].errors"
                    placeholder="João Silva"
                  />
                  <div *ngIf="submitted && f['nome'].errors" class="invalid-feedback">
                    <div *ngIf="f['nome'].errors['required']">Nome é obrigatório</div>
                    <div *ngIf="f['nome'].errors['minlength']">Nome deve ter no mínimo 3 caracteres</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="submitted && f['email'].errors"
                    placeholder="joao@email.com"
                  />
                  <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                    <div *ngIf="f['email'].errors['required']">Email é obrigatório</div>
                    <div *ngIf="f['email'].errors['email']">Email inválido</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="senha" class="form-label">
                    Senha {{ isEditMode ? '(deixe em branco para não alterar)' : '*' }}
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="senha"
                    formControlName="senha"
                    [class.is-invalid]="submitted && f['senha'].errors"
                    placeholder="••••••••"
                  />
                  <div *ngIf="submitted && f['senha'].errors" class="invalid-feedback">
                    <div *ngIf="f['senha'].errors['required']">Senha é obrigatória</div>
                    <div *ngIf="f['senha'].errors['minlength']">Senha deve ter no mínimo 6 caracteres</div>
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="error">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!loading" class="bi bi-check-circle me-2"></i>
                    {{ loading ? 'Salvando...' : 'Salvar' }}
                  </button>
                  <a routerLink="/usuarios" class="btn btn-secondary">
                    <i class="bi bi-x-circle me-2"></i>
                    Cancelar
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Informações
              </h5>
            </div>
            <div class="card-body">
              <p class="small mb-2"><strong>Campos obrigatórios:</strong></p>
              <ul class="small">
                <li>Nome completo</li>
                <li>Email válido</li>
                <li *ngIf="!isEditMode">Senha (mínimo 6 caracteres)</li>
              </ul>
              <hr>
              <p class="small text-muted mb-0">
                {{ isEditMode ? 'Atualize os dados do usuário conforme necessário.' : 'O usuário será criado com perfil padrão de Usuário.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
  `]
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  isEditMode = false;
  usuarioId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.usuarioForm.controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.usuarioId = +params['id'];
        this.carregarUsuario();
        // Remove validação required da senha no modo edição
        this.usuarioForm.get('senha')?.clearValidators();
        this.usuarioForm.get('senha')?.setValidators([Validators.minLength(6)]);
        this.usuarioForm.get('senha')?.updateValueAndValidity();
      }
    });
  }

  carregarUsuario(): void {
    if (this.usuarioId) {
      this.usuarioService.buscarPorId(this.usuarioId).subscribe({
        next: (usuario) => {
          this.usuarioForm.patchValue({
            nome: usuario.nome,
            email: usuario.email
          });
        },
        error: (error) => {
          this.error = 'Erro ao carregar usuário: ' + error.message;
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.usuarioForm.invalid) {
      return;
    }

    this.loading = true;

    const formValue = this.usuarioForm.value;
    
    // Remove senha vazia no modo edição
    if (this.isEditMode && !formValue.senha) {
      delete formValue.senha;
    }

    const operation = this.isEditMode && this.usuarioId
      ? this.usuarioService.atualizar(this.usuarioId, formValue)
      : this.usuarioService.criar(formValue);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        this.error = error.message || 'Erro ao salvar usuário.';
        this.loading = false;
      }
    });
  }
}
