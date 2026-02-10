import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors) {
          const errors = error.error.errors;
          errorMessage = Object.keys(errors).map(key => errors[key]).join(', ');
        } else {
          errorMessage = `Erro ${error.status}: ${error.message}`;
        }
      }

      console.error('Erro HTTP:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
