import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" *ngIf="isLoggedIn()">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="bi bi-bus-front-fill me-2"></i>
          Urbana
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/usuarios" routerLinkActive="active">
                <i class="bi bi-people-fill me-1"></i>
                Usuários
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/cartoes" routerLinkActive="active">
                <i class="bi bi-credit-card-fill me-1"></i>
                Cartões
              </a>
            </li>
          </ul>
          <div class="d-flex align-items-center">
            <span class="text-white me-3">
              <i class="bi bi-person-circle me-1"></i>
              {{ currentUser?.nome }}
              <span class="badge bg-light text-primary ms-2" *ngIf="isAdmin()">Admin</span>
            </span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              <i class="bi bi-box-arrow-right me-1"></i>
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="main-container" [class.container-fluid]="isLoggedIn()" [class.p-0]="!isLoggedIn()">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-link {
      transition: all 0.2s;
    }

    .nav-link:hover {
      transform: translateY(-1px);
    }

    .nav-link.active {
      font-weight: 600;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.25rem;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get currentUser() {
    return this.authService.currentUserValue;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
