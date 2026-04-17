import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProdutoCadastroComponent } from './components/produto-cadastro/produto-cadastro';
// 1. Importe o novo componente aqui (verifique se o caminho está certo)
import { NotaFiscalCadastroComponent } from './components/nota-fiscal-cadastro/nota-fiscal-cadastro';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    ProdutoCadastroComponent,
    NotaFiscalCadastroComponent,
    HttpClientModule, // 3. Adicione aqui para a API funcionar
    FormsModule       // 4. Adicione aqui para o formulário funcionar
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}