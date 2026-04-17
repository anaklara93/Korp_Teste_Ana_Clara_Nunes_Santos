using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.Models;

namespace ServicoFaturamento.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotasFiscaisController : ControllerBase
{
    private readonly FaturamentoDbContext _context;

    public NotasFiscaisController(FaturamentoDbContext context)
    {
        _context = context;
    }

    // Listar todas as notas (para a tabela do Angular)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotaFiscal>>> GetNotas()
    {
        return await _context.NotasFiscais.Include(n => n.Itens).ToListAsync();
    }

    // Salvar uma nota nova
    [HttpPost]
    public async Task<ActionResult<NotaFiscal>> PostNota(NotaFiscal nota)
    {
        nota.Status = "Aberta"; // Regra do edital: começa como Aberta
        _context.NotasFiscais.Add(nota);
        await _context.SaveChangesAsync();
        return Ok(nota);
    }
}