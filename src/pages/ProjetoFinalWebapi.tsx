import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoFinalWebapi() {
  return (
    <PageContainer
      title="Projeto final: API REST completa de Tarefas"
      subtitle="Junte tudo o que aprendeu — minimal API, EF Core SQLite, validação, Swagger e Docker — em um único app passo a passo."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <p>
        Chegou a hora de juntar as peças. Neste capítulo final você vai construir, do zero, uma <strong>API REST</strong> ("Application Programming Interface" no estilo Representational State Transfer — em português, um servidor HTTP que expõe operações sobre recursos via verbos GET/POST/PUT/DELETE) para gerenciar tarefas. Vai persistir em <strong>SQLite</strong> (banco de dados num único arquivo, ideal para começar), expor documentação interativa via <strong>Swagger</strong> e empacotar tudo em um container <strong>Docker</strong> pronto para deploy.
      </p>

      <h2>Passo 1 — Criando o projeto</h2>
      <pre><code>{`# Cria um projeto Web API com template minimal API
dotnet new webapi -minimal -o ApiTarefas
cd ApiTarefas

# Pacotes do EF Core para SQLite
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design

# Pacote para validar entradas
dotnet add package FluentValidation.AspNetCore`}</code></pre>

      <h2>Passo 2 — Modelo e DbContext</h2>
      <p>
        O <strong>modelo</strong> é a classe C# que representa a tabela. O <strong>DbContext</strong> é a porta de entrada para o banco — ele expõe coleções (<code>DbSet</code>) que correspondem às tabelas.
      </p>
      <pre><code>{`// Models/Tarefa.cs
namespace ApiTarefas.Models;

public class Tarefa
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public string? Descricao { get; set; }
    public bool Concluida { get; set; }
    public DateTime CriadaEm { get; set; } = DateTime.UtcNow;
}

// Data/AppDb.cs
using Microsoft.EntityFrameworkCore;
using ApiTarefas.Models;

namespace ApiTarefas.Data;

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> opt) : base(opt) { }
    public DbSet<Tarefa> Tarefas => Set<Tarefa>();
}`}</code></pre>

      <h2>Passo 3 — Configurando serviços no <code>Program.cs</code></h2>
      <pre><code>{`using Microsoft.EntityFrameworkCore;
using ApiTarefas.Data;
using ApiTarefas.Models;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Banco SQLite no arquivo tarefas.db
builder.Services.AddDbContext<AppDb>(opt =>
    opt.UseSqlite("Data Source=tarefas.db"));

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Validações
builder.Services.AddScoped<IValidator<Tarefa>, TarefaValidator>();

var app = builder.Build();

// Cria o banco se ainda não existir (em produção use migrations)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}`}</code></pre>

      <h2>Passo 4 — Validação com FluentValidation</h2>
      <pre><code>{`// Validators/TarefaValidator.cs
using FluentValidation;
using ApiTarefas.Models;

public class TarefaValidator : AbstractValidator<Tarefa>
{
    public TarefaValidator()
    {
        RuleFor(t => t.Titulo)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MaximumLength(120);

        RuleFor(t => t.Descricao)
            .MaximumLength(500);
    }
}`}</code></pre>

      <h2>Passo 5 — Endpoints CRUD com Minimal API</h2>
      <p>
        Cada verbo HTTP vira uma chamada ao app: <code>MapGet</code>, <code>MapPost</code>, <code>MapPut</code>, <code>MapDelete</code>. Agrupar por prefixo deixa o código limpo.
      </p>
      <pre><code>{`var grupo = app.MapGroup("/tarefas").WithTags("Tarefas");

// GET /tarefas — lista todas
grupo.MapGet("/", async (AppDb db) =>
    await db.Tarefas.AsNoTracking().ToListAsync());

// GET /tarefas/{id} — busca uma
grupo.MapGet("/{id:int}", async (int id, AppDb db) =>
    await db.Tarefas.FindAsync(id) is Tarefa t
        ? Results.Ok(t)
        : Results.NotFound());

// POST /tarefas — cria
grupo.MapPost("/", async (Tarefa nova, IValidator<Tarefa> v, AppDb db) =>
{
    var resultado = await v.ValidateAsync(nova);
    if (!resultado.IsValid)
        return Results.ValidationProblem(resultado.ToDictionary());

    db.Tarefas.Add(nova);
    await db.SaveChangesAsync();
    return Results.Created($"/tarefas/{nova.Id}", nova);
});

// PUT /tarefas/{id} — atualiza
grupo.MapPut("/{id:int}", async (int id, Tarefa atual,
                                  IValidator<Tarefa> v, AppDb db) =>
{
    var existente = await db.Tarefas.FindAsync(id);
    if (existente is null) return Results.NotFound();

    var r = await v.ValidateAsync(atual);
    if (!r.IsValid) return Results.ValidationProblem(r.ToDictionary());

    existente.Titulo    = atual.Titulo;
    existente.Descricao = atual.Descricao;
    existente.Concluida = atual.Concluida;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETE /tarefas/{id} — apaga
grupo.MapDelete("/{id:int}", async (int id, AppDb db) =>
{
    var t = await db.Tarefas.FindAsync(id);
    if (t is null) return Results.NotFound();

    db.Tarefas.Remove(t);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();`}</code></pre>

      <AlertBox type="info" title="Por que <code>AsNoTracking</code> em GET">
        O EF Core, por padrão, "rastreia" todas as entidades carregadas para detectar mudanças. Isso custa memória e CPU. Em endpoints só-leitura, <code>AsNoTracking()</code> dispensa o rastreamento e deixa as queries notavelmente mais rápidas.
      </AlertBox>

      <h2>Passo 6 — Testando com Swagger UI</h2>
      <pre><code>{`# Roda o app
dotnet run

# Abra no navegador (porta padrão pode variar):
# https://localhost:7115/swagger
#
# Você verá a UI interativa listando os 5 endpoints.
# Pode criar, listar e apagar tarefas direto pela página.`}</code></pre>

      <p>
        Ou via <code>curl</code> no terminal:
      </p>
      <pre><code>{`# Cria
curl -X POST https://localhost:7115/tarefas \\
     -H "Content-Type: application/json" \\
     -d '{"titulo":"Estudar C#","concluida":false}'

# Lista
curl https://localhost:7115/tarefas

# Marca como concluída (id=1)
curl -X PUT https://localhost:7115/tarefas/1 \\
     -H "Content-Type: application/json" \\
     -d '{"id":1,"titulo":"Estudar C#","concluida":true}'

# Apaga
curl -X DELETE https://localhost:7115/tarefas/1`}</code></pre>

      <h2>Passo 7 — Empacotando em Docker</h2>
      <p>
        <strong>Docker</strong> empacota seu app + runtime + dependências num <em>container</em> que roda igual em qualquer máquina. O <strong>Dockerfile</strong> abaixo usa o padrão <em>multi-stage</em>: uma imagem grande para compilar e uma pequena para rodar.
      </p>
      <pre><code>{`# Dockerfile (na raiz do projeto)

# Estágio 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app /p:UseAppHost=false

# Estágio 2: runtime mínimo (sem SDK, só ASP.NET)
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "ApiTarefas.dll"]`}</code></pre>

      <p>
        Adicione um <code>.dockerignore</code> para não copiar lixo:
      </p>
      <pre><code>{`# .dockerignore
bin/
obj/
*.db
.vs/
.vscode/`}</code></pre>

      <pre><code>{`# Build da imagem
docker build -t api-tarefas .

# Run mapeando porta 8080 do container -> 5000 do host
# E persistindo o tarefas.db num volume nomeado
docker run -p 5000:8080 -v tarefas-data:/app api-tarefas

# Acesse: http://localhost:5000/swagger`}</code></pre>

      <AlertBox type="warning" title="Migrations em produção">
        Usamos <code>EnsureCreated()</code> para simplicidade. Em produção use <strong>EF Core Migrations</strong> (<code>dotnet ef migrations add Inicial</code> + <code>dotnet ef database update</code>) — assim você versiona mudanças de esquema, evolui a tabela sem perder dados e aplica em ambientes diferentes de forma controlada.
      </AlertBox>

      <h2>Próximos passos sugeridos</h2>
      <ul>
        <li>Adicionar autenticação JWT (capítulo anterior) e proteger PUT/DELETE.</li>
        <li>Substituir SQLite por PostgreSQL via <code>Npgsql.EntityFrameworkCore.PostgreSQL</code>.</li>
        <li>Cobrir os endpoints com testes xUnit + WebApplicationFactory.</li>
        <li>Adicionar logging estruturado (<code>ILogger</code>) e observabilidade (OpenTelemetry).</li>
        <li>Subir no Azure App Service, AWS ECS ou Fly.io usando a imagem Docker.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>EnsureCreated()</code></strong> ou migration: as tabelas não existem e tudo dá erro 500.</li>
        <li><strong>Banco bloqueado</strong> rodando dentro e fora do container ao mesmo tempo: SQLite assume acesso exclusivo.</li>
        <li><strong>Porta diferente</strong>: o ASP.NET escuta numa porta padrão; se o container usa outra, mapeie corretamente no <code>-p</code>.</li>
        <li><strong>Não copiar para volume</strong>: ao parar o container, o <code>.db</code> some. Sempre use <code>-v</code>.</li>
        <li><strong>Faltar <code>AddDbContext</code></strong>: o injetor não consegue criar o <code>AppDb</code> e os endpoints lançam exceção em runtime.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dotnet new webapi -minimal</code> cria a base de uma API REST moderna.</li>
        <li>EF Core + SQLite oferece persistência simples num único arquivo.</li>
        <li>Minimal API expõe CRUD com <code>MapGet</code>/<code>MapPost</code>/<code>MapPut</code>/<code>MapDelete</code>.</li>
        <li>FluentValidation centraliza regras de entrada e devolve <em>ValidationProblem</em> automaticamente.</li>
        <li>Swagger UI dá documentação interativa em desenvolvimento.</li>
        <li>Dockerfile multi-stage gera imagem enxuta pronta para deploy em qualquer nuvem.</li>
        <li>Próximo passo natural: JWT, testes, migrations e observabilidade.</li>
      </ul>
    </PageContainer>
  );
}
