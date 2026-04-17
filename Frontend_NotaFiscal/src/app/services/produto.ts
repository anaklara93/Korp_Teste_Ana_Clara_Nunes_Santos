import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  codigo: string;
  descricao: string;
  saldo: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  
  private apiUrl = 'http://localhost:5077/api/Produtos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  salvar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(produto: Produto): Observable<any> {
    // O PUT serve para atualizar o objeto inteiro no banco
    return this.http.put(`${this.apiUrl}/${produto.id}`, produto);
  }
}