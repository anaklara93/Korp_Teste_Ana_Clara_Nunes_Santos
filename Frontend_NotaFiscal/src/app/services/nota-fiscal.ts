import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../models/nota-fiscal.model'; // Importa aquele molde que criamos

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  // Endereço do nosso microsserviço de faturamento
  private apiUrl = 'http://localhost:5011/api/NotasFiscais';

  constructor(private http: HttpClient) { }

  // Função para listar as notas (o GET do Swagger)
  getNotas(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl);
  }

  // Função para salvar a nota nova (o POST do Swagger)
  salvarNota(nota: NotaFiscal): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.apiUrl, nota);
  }
}