namespace ServicoFaturamento.Models;

public class NotaFiscal
{
    public int Id { get; set; }
    public int Numero { get; set; } // Numeração sequencial
    public string Status { get; set; } = "Aberta"; // Inicia como Aberta
    public List<ItemNota> Itens { get; set; } = new();
}

public class ItemNota
{
    public int Id { get; set; }
    public int ProdutoId { get; set; } // Referência ao ID do produto lá do outro microsserviço
    public int Quantidade { get; set; }
}