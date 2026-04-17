using Microsoft.EntityFrameworkCore;
using ServicoEstoque;

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURAÇÕES (SERVICES) ---
builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=estoque.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy => 
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build(); // O BUILDER TERMINA AQUI

// --- USOS (MIDDLEWARES) ---
app.UseCors("AllowAngular");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// MapControllers é o que faz o Angular achar sua API de Produtos!
app.MapControllers(); 

app.Run();