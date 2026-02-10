export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  role?: string;
  ativo?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  cartoes?: Cartao[];
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  role?: string;
}

export interface UsuarioUpdate {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface Cartao {
  id?: number;
  numeroCartao: number;
  nome: string;
  status: boolean;
  tipoCartao: TipoCartao;
  usuarioId?: number;
  usuarioNome?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export enum TipoCartao {
  COMUM = 'COMUM',
  ESTUDANTE = 'ESTUDANTE',
  TRABALHADOR = 'TRABALHADOR'
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
  nome: string;
  email: string;
  role: string;
}
