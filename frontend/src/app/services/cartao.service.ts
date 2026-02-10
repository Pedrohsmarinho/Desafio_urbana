import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cartao } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private apiUrl = `${environment.apiUrl}/cartoes`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(this.apiUrl);
  }

  listarAtivos(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(`${this.apiUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<Cartao> {
    return this.http.get<Cartao>(`${this.apiUrl}/${id}`);
  }

  listarPorUsuario(usuarioId: number): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  adicionarCartaoAoUsuario(usuarioId: number, cartao: Cartao): Observable<Cartao> {
    return this.http.post<Cartao>(`${this.apiUrl}/usuario/${usuarioId}`, cartao);
  }

  atualizar(id: number, cartao: Cartao): Observable<Cartao> {
    return this.http.put<Cartao>(`${this.apiUrl}/${id}`, cartao);
  }

  ativarOuDesativar(id: number, status: boolean): Observable<Cartao> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.patch<Cartao>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  removerCartaoDoUsuario(usuarioId: number, cartaoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartaoId}/usuario/${usuarioId}`);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
