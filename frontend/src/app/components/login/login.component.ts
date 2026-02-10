import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="text-center mb-4">
          <i class="bi bi-bus-front-fill text-primary" style="font-size: 3rem;"></i>
          <h2 class="mt-3">Sistema Urbana</h2>
          <p class="text-muted">Gestão de Usuários e Cartões</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input
                type="email"
                class="form-control"
                id="email"
                formControlName="email"
                [class.is-invalid]="submitted && f['email'].errors"
                placeholder="seu@email.com"
              />
            </div>
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback d-block">
              <div *ngIf="f['email'].errors['required']">Email é obrigatório</div>
              <div *ngIf="f['email'].errors['email']">Email inválido</div>
            </div>
          </div>

          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                type="password"
                class="form-control"
                id="senha"
                formControlName="senha"
                [class.is-invalid]="submitted && f['senha'].errors"
                placeholder="••••••••"
              />
            </div>
            <div *ngIf="submitted && f['senha'].errors" class="invalid-feedback d-block">
              <div *ngIf="f['senha'].errors['required']">Senha é obrigatória</div>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="error">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!loading" class="bi bi-box-arrow-in-right me-2"></i>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="text-center">
            <p class="text-muted">
              Não tem uma conta?
              <a routerLink="/registrar" class="text-primary">Registre-se aqui</a>
            </p>
          </div>
        </form>

        <div class="mt-4 pt-4 border-top">
          <p class="text-muted small mb-2"><strong>Credenciais de teste:</strong></p>
          <p class="text-muted small mb-1">Admin: admin&#64;urbana.com / admin123</p>
          <p class="text-muted small mb-0">User: user&#64;urbana.com / user123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
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

    .input-group-text {
      background-color: #f8f9fa;
    }

    @media (max-width: 576px) {
      .login-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.error = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
        this.loading = false;
      }
    });
  }
}
