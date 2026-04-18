using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ServicoEstoque.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProdutosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/produtos (Lista todos os produtos)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
    {
        return await _context.Produtos.ToListAsync();
    }

    // POST: api/produtos (Cadastra um novo produto)
    [HttpPost]
    public async Task<ActionResult<Produto>> PostProduto(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return Ok(produto);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduto(int id, Produto produtoEnviado)
    {
        // Buscamos o produto no banco
        var produtoNoBanco = await _context.Produtos.FirstOrDefaultAsync(p => p.Id == id);

        if (produtoNoBanco == null) return NotFound();

        // CALCULA A DIFERENÇA (Ajuste 'Saldo' para o nome que está no seu Model)
        int quantidadeVendida = produtoNoBanco.Saldo - produtoEnviado.Saldo;

        // TRAVA DE SEGURANÇA
        if (produtoNoBanco.Saldo < quantidadeVendida)
        {
            return BadRequest("Saldo insuficiente!");
        }

        // ATUALIZAÇÃO
        produtoNoBanco.Saldo -= quantidadeVendida;

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/baixar")]
    public async Task<IActionResult> BaixarEstoque(int id, [FromBody] int quantidadeParaTirar)
    {
        // 1. Busca o produto direto no banco de dados
        var produtoNoBanco = await _context.Produtos.FindAsync(id);

        if (produtoNoBanco == null) return NotFound("Produto não encontrado.");

        // 2. A TRAVA DE SEGURANÇA (Opcional A):
        // Verificamos o saldo real do banco contra a quantidade pedida
        if (produtoNoBanco.Saldo < quantidadeParaTirar)
        {
            return BadRequest("Estoque insuficiente para esta operação!");
        }

        // 3. Subtrai e salva
        produtoNoBanco.Saldo -= quantidadeParaTirar;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
