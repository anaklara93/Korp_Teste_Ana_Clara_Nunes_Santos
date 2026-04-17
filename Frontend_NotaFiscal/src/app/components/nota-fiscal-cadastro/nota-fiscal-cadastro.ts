import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Importamos o ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotaFiscalService } from '../../services/nota-fiscal';
import { ProdutoService } from '../../services/produto';
import { NotaFiscal, ItemNota } from '../../models/nota-fiscal.model';

@Component({
  selector: 'app-nota-fiscal-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nota-fiscal-cadastro.html',
  styleUrl: './nota-fiscal-cadastro.css'
})
export class NotaFiscalCadastroComponent implements OnInit {
  produtos: any[] = [];
  novaNota: NotaFiscal = { numero: 0, status: 'Aberta', itens: [] };
  itemAtual: ItemNota = { produtoId: 0, quantidade: 1 };

  notaSalvaId: number | null = null;
  imprimindo: boolean = false;

  constructor(
    private notaService: NotaFiscalService,
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef // Injetamos aqui
  ) { }

  ngOnInit() {
    this.carregarProdutos();
    this.buscarProximoNumero(); // Busca o número assim que abre a tela
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe({
      next: (data) => this.produtos = data,
      error: () => alert('Erro ao conectar ao serviço de estoque! (Tratamento de Falhas)')
    });
  }

  // Lógica para numeração sequencial automática
  buscarProximoNumero() {
    this.notaService.getNotas().subscribe({
      next: (notas: any[]) => {
        // Se a lista existir e tiver pelo menos uma nota
        if (notas && notas.length > 0) {
          const maiorNumero = Math.max(...notas.map(n => n.numero));
          this.novaNota.numero = maiorNumero + 1;
        } else {
          // Se o banco estiver vazio começa no 1
          this.novaNota.numero = 1;
        }
        this.cdr.detectChanges(); // Força o Angular a mostrar o "1" na tela
      },
      error: (err) => {
        console.error("Erro ao buscar notas, definindo padrão como 1", err);
        this.novaNota.numero = 1;
        this.cdr.detectChanges();
      }
    });
  }

  adicionarItem() {
    // 1. Localiza o produto completo na lista que veio da API
    const produtoNoEstoque = this.produtos.find(p => p.id == this.itemAtual.produtoId);

    if (produtoNoEstoque) {
      // NOVA TRAVA: Impede números negativos ou zero
      if (this.itemAtual.quantidade <= 0) {
        alert("A quantidade deve ser maior que zero!");
        return;
      }

      // 2. Valida se tem saldo suficiente
      if (this.itemAtual.quantidade > produtoNoEstoque.saldo) {
        alert(`Estoque insuficiente! Você só tem ${produtoNoEstoque.saldo} unidades de ${produtoNoEstoque.descricao}.`);
        return;
      }

      // 3. Se passou em todas as validações, adiciona
      this.novaNota.itens.push({ ...this.itemAtual });
      this.itemAtual = { produtoId: 0, quantidade: 1 };

    } else {
      alert("Selecione um produto válido!");
    }
  }

  salvar() {
    this.notaService.salvarNota(this.novaNota).subscribe({
      next: (res: any) => {
        this.notaSalvaId = res.id || res.Id;

        // MÁGICA AQUI: O detectChanges faz o botão imprimir aparecer na hora!
        this.cdr.detectChanges();

        alert('Nota Fiscal salva com sucesso! Clique em imprimir para prosseguir com a impressão da nota');
      },
      error: () => alert('Erro ao salvar nota!')
    });
  }

  imprimir() {
    if (this.novaNota.status !== 'Aberta') return;
    this.imprimindo = true;

    setTimeout(() => {
      this.novaNota.status = 'Fechada';

      this.novaNota.itens.forEach(item => {
        let p = this.produtos.find(prod => prod.id == item.produtoId);

        if (!p) {
          p = this.produtos.find(prod => prod.codigo == item.produtoId.toString());
        }

        if (p) {
          // 1. Atualizamos o saldo na nossa lista LOCAL primeiro (para a tela mudar na hora)
          p.saldo -= item.quantidade;

          const produtoAtualizado = { ...p };

          // 2. Avisamos o servidor
          this.produtoService.atualizar(produtoAtualizado).subscribe({
            next: () => {
              console.log("Sucesso no banco!");
            },
            error: (err) => {
              console.error("Erro ao atualizar saldo no banco:", err);
              // Se der erro no banco, você "devolve" o saldo no local para não mentir pro usuário
              p.saldo += item.quantidade;
            }
          });
        }
      });

      this.imprimindo = false;
      this.cdr.detectChanges(); // Isso força o Angular a atualizar o HTML
    }, 2000);
  }

  novaVenda() {
    // Limpa tudo para a próxima nota
    this.novaNota = { numero: 0, status: 'Aberta', itens: [] };
    this.notaSalvaId = null;
    this.buscarProximoNumero(); // Já puxa o próximo número automático
    this.cdr.detectChanges();
  }

  removerItem(index: number) {
    // O splice remove 1 elemento a partir da posição 'index'
    this.novaNota.itens.splice(index, 1);

  }

}