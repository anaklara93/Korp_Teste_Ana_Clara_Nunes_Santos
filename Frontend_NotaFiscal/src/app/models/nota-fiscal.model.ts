export interface ItemNota {
  produtoId: number;
  quantidade: number;
}

export interface NotaFiscal {
  id?: number;
  numero: number;
  status: string;
  itens: ItemNota[];
}