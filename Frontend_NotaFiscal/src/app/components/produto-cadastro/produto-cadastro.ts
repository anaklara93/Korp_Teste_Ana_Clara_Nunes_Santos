import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto';

@Component({
  selector: 'app-produto-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto-cadastro.html',
  styleUrls: ['./produto-cadastro.css']
})
export class ProdutoCadastroComponent implements OnInit {
  // Ajuste 1: Adicione o id: 0 aqui no início para bater com o C#
  novoProduto = { id: 0, codigo: '', descricao: '', saldo: 0 };
  produtos: any[] = [];

  constructor(
    private produtoService: ProdutoService,
    private cd: ChangeDetectorRef
  ) {
    // Tirei o listar daqui! O lugar certo é no ngOnInit
  }

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.produtoService.listar().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.produtos = [...data];

        setTimeout(() => {
          this.cd.markForCheck();
          this.cd.detectChanges();
        }, 0);
      },
      error: (err) => console.error('Erro ao listar:', err)
    });
  }

  salvar() {
    // Verifique se os campos estão preenchidos antes de enviar
    if (!this.novoProduto.codigo || !this.novoProduto.descricao) {
      alert('Preencha os campos corretamente!');
      return;
    }
    if (this.novoProduto.saldo < 0) {
      alert('Estoque inválido (negativo). Coloque 0 ou mais.');
      return; // O return para a execução aqui e não envia para o C#
    }

    this.produtoService.salvar(this.novoProduto).subscribe({
      next: (res) => {
        alert('Produto salvo com sucesso!');
        // Ajuste 3: Resetando o objeto mantendo a estrutura original
        this.novoProduto = { id: 0, codigo: '', descricao: '', saldo: 0 };
        this.listar();
      },
      error: (err) => {
        console.error('Erro detalhado:', err);
        alert('Erro ao salvar! Verifique se o Backend está rodando.');
      }
    });
  }
}