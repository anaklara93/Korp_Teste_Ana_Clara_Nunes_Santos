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

    // PUT: api/produtos/{id} (Atualiza o produto, inclusive o saldo)
    [HttpPut("{id}")]
public async Task<IActionResult> PutProduto(int id, Produto produto)
{
    // LOG DE EMERGÊNCIA: Isso vai aparecer no seu terminal preto do VS Code
    Console.WriteLine($"\n---> RECEBI CHAMADA PARA ATUALIZAR ID: {id}");
    Console.WriteLine($"---> SALDO ENVIADO: {produto.Saldo}");

    // Forçamos o ID que veio na URL para dentro do objeto (evita erro de Id vs id)
    produto.Id = id; 

    // Avisa o banco que esse objeto mudou
    _context.Entry(produto).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
        Console.WriteLine("---> SUCESSO: Banco de dados atualizado no arquivo .db!\n");
        return NoContent();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"---> ERRO NO C#: {ex.Message}\n");
        return BadRequest(ex.Message);
    }
}
}