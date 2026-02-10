import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus-fill text-primary" style="font-size: 3rem;"></i>
          <h2 class="mt-3">Criar Conta</h2>
          <p class="text-muted">Preencha os dados para se registrar</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome Completo</label>
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
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              formControlName="email"
              [class.is-invalid]="submitted && f['email'].errors"
              placeholder="seu@email.com"
            />
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
              <div *ngIf="f['email'].errors['required']">Email é obrigatório</div>
              <div *ngIf="f['email'].errors['email']">Email inválido</div>
            </div>
          </div>

          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
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

          <div class="mb-3">
            <label for="confirmarSenha" class="form-label">Confirmar Senha</label>
            <input
              type="password"
              class="form-control"
              id="confirmarSenha"
              formControlName="confirmarSenha"
              [class.is-invalid]="submitted && f['confirmarSenha'].errors"
              placeholder="••••••••"
            />
            <div *ngIf="submitted && f['confirmarSenha'].errors" class="invalid-feedback">
              <div *ngIf="f['confirmarSenha'].errors['required']">Confirmação de senha é obrigatória</div>
              <div *ngIf="f['confirmarSenha'].errors['mustMatch']">Senhas não conferem</div>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="error">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <div class="alert alert-success" *ngIf="success">
            <i class="bi bi-check-circle me-2"></i>
            Conta criada com sucesso! Redirecionando...
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!loading" class="bi bi-person-check me-2"></i>
            {{ loading ? 'Registrando...' : 'Registrar' }}
          </button>

          <div class="text-center">
            <p class="text-muted">
              Já tem uma conta?
              <a routerLink="/login" class="text-primary">Faça login aqui</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      width: 100%;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 576px) {
      .register-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class RegistrarComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, {
      validators: this.mustMatch('senha', 'confirmarSenha')
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = false;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const { confirmarSenha, ...userData } = this.registerForm.value;

    this.authService.registrar(userData).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.error = error.message || 'Erro ao criar conta. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
