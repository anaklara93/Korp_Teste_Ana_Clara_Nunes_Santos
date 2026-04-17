using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.Models; // Ajuste o namespace se necessário

var builder = WebApplication.CreateBuilder(args);

// 1. Banco de dados próprio do Faturamento
builder.Services.AddDbContext<FaturamentoDbContext>(options =>
    options.UseSqlite("Data Source=faturamento.db"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. CORS para o Angular conseguir falar com esse novo serviço
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy => 
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAngular");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// IMPORTANTE: Use apenas uma porta diferente do estoque (ex: 5088)
// No Debian, vamos evitar o HttpsRedirection para não dar erro de porta
app.MapControllers();

app.Run();

// --- Contexto do Banco ---
public class FaturamentoDbContext : DbContext
{
    public FaturamentoDbContext(DbContextOptions<FaturamentoDbContext> options) : base(options) { }
    public DbSet<NotaFiscal> NotasFiscais { get; set; }
    public DbSet<ItemNota> ItensNota { get; set; }
}