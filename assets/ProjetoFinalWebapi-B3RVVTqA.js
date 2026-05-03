import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Projeto final: API REST completa de Tarefas",subtitle:"Junte tudo o que aprendeu — minimal API, EF Core SQLite, validação, Swagger e Docker — em um único app passo a passo.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsxs("p",{children:["Chegou a hora de juntar as peças. Neste capítulo final você vai construir, do zero, uma ",e.jsx("strong",{children:"API REST"}),' ("Application Programming Interface" no estilo Representational State Transfer — em português, um servidor HTTP que expõe operações sobre recursos via verbos GET/POST/PUT/DELETE) para gerenciar tarefas. Vai persistir em ',e.jsx("strong",{children:"SQLite"})," (banco de dados num único arquivo, ideal para começar), expor documentação interativa via ",e.jsx("strong",{children:"Swagger"})," e empacotar tudo em um container ",e.jsx("strong",{children:"Docker"})," pronto para deploy."]}),e.jsx("h2",{children:"Passo 1 — Criando o projeto"}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria um projeto Web API com template minimal API
dotnet new webapi -minimal -o ApiTarefas
cd ApiTarefas

# Pacotes do EF Core para SQLite
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design

# Pacote para validar entradas
dotnet add package FluentValidation.AspNetCore`})}),e.jsx("h2",{children:"Passo 2 — Modelo e DbContext"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"modelo"})," é a classe C# que representa a tabela. O ",e.jsx("strong",{children:"DbContext"})," é a porta de entrada para o banco — ele expõe coleções (",e.jsx("code",{children:"DbSet"}),") que correspondem às tabelas."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Models/Tarefa.cs
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
}`})}),e.jsxs("h2",{children:["Passo 3 — Configurando serviços no ",e.jsx("code",{children:"Program.cs"})]}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.EntityFrameworkCore;
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
}`})}),e.jsx("h2",{children:"Passo 4 — Validação com FluentValidation"}),e.jsx("pre",{children:e.jsx("code",{children:`// Validators/TarefaValidator.cs
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
}`})}),e.jsx("h2",{children:"Passo 5 — Endpoints CRUD com Minimal API"}),e.jsxs("p",{children:["Cada verbo HTTP vira uma chamada ao app: ",e.jsx("code",{children:"MapGet"}),", ",e.jsx("code",{children:"MapPost"}),", ",e.jsx("code",{children:"MapPut"}),", ",e.jsx("code",{children:"MapDelete"}),". Agrupar por prefixo deixa o código limpo."]}),e.jsx("pre",{children:e.jsx("code",{children:`var grupo = app.MapGroup("/tarefas").WithTags("Tarefas");

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

app.Run();`})}),e.jsxs(a,{type:"info",title:"Por que <code>AsNoTracking</code> em GET",children:['O EF Core, por padrão, "rastreia" todas as entidades carregadas para detectar mudanças. Isso custa memória e CPU. Em endpoints só-leitura, ',e.jsx("code",{children:"AsNoTracking()"})," dispensa o rastreamento e deixa as queries notavelmente mais rápidas."]}),e.jsx("h2",{children:"Passo 6 — Testando com Swagger UI"}),e.jsx("pre",{children:e.jsx("code",{children:`# Roda o app
dotnet run

# Abra no navegador (porta padrão pode variar):
# https://localhost:7115/swagger
#
# Você verá a UI interativa listando os 5 endpoints.
# Pode criar, listar e apagar tarefas direto pela página.`})}),e.jsxs("p",{children:["Ou via ",e.jsx("code",{children:"curl"})," no terminal:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria
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
curl -X DELETE https://localhost:7115/tarefas/1`})}),e.jsx("h2",{children:"Passo 7 — Empacotando em Docker"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Docker"})," empacota seu app + runtime + dependências num ",e.jsx("em",{children:"container"})," que roda igual em qualquer máquina. O ",e.jsx("strong",{children:"Dockerfile"})," abaixo usa o padrão ",e.jsx("em",{children:"multi-stage"}),": uma imagem grande para compilar e uma pequena para rodar."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Dockerfile (na raiz do projeto)

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
ENTRYPOINT ["dotnet", "ApiTarefas.dll"]`})}),e.jsxs("p",{children:["Adicione um ",e.jsx("code",{children:".dockerignore"})," para não copiar lixo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# .dockerignore
bin/
obj/
*.db
.vs/
.vscode/`})}),e.jsx("pre",{children:e.jsx("code",{children:`# Build da imagem
docker build -t api-tarefas .

# Run mapeando porta 8080 do container -> 5000 do host
# E persistindo o tarefas.db num volume nomeado
docker run -p 5000:8080 -v tarefas-data:/app api-tarefas

# Acesse: http://localhost:5000/swagger`})}),e.jsxs(a,{type:"warning",title:"Migrations em produção",children:["Usamos ",e.jsx("code",{children:"EnsureCreated()"})," para simplicidade. Em produção use ",e.jsx("strong",{children:"EF Core Migrations"})," (",e.jsx("code",{children:"dotnet ef migrations add Inicial"})," + ",e.jsx("code",{children:"dotnet ef database update"}),") — assim você versiona mudanças de esquema, evolui a tabela sem perder dados e aplica em ambientes diferentes de forma controlada."]}),e.jsx("h2",{children:"Próximos passos sugeridos"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Adicionar autenticação JWT (capítulo anterior) e proteger PUT/DELETE."}),e.jsxs("li",{children:["Substituir SQLite por PostgreSQL via ",e.jsx("code",{children:"Npgsql.EntityFrameworkCore.PostgreSQL"}),"."]}),e.jsx("li",{children:"Cobrir os endpoints com testes xUnit + WebApplicationFactory."}),e.jsxs("li",{children:["Adicionar logging estruturado (",e.jsx("code",{children:"ILogger"}),") e observabilidade (OpenTelemetry)."]}),e.jsx("li",{children:"Subir no Azure App Service, AWS ECS ou Fly.io usando a imagem Docker."})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"EnsureCreated()"})]})," ou migration: as tabelas não existem e tudo dá erro 500."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Banco bloqueado"})," rodando dentro e fora do container ao mesmo tempo: SQLite assume acesso exclusivo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Porta diferente"}),": o ASP.NET escuta numa porta padrão; se o container usa outra, mapeie corretamente no ",e.jsx("code",{children:"-p"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não copiar para volume"}),": ao parar o container, o ",e.jsx("code",{children:".db"})," some. Sempre use ",e.jsx("code",{children:"-v"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Faltar ",e.jsx("code",{children:"AddDbContext"})]}),": o injetor não consegue criar o ",e.jsx("code",{children:"AppDb"})," e os endpoints lançam exceção em runtime."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"dotnet new webapi -minimal"})," cria a base de uma API REST moderna."]}),e.jsx("li",{children:"EF Core + SQLite oferece persistência simples num único arquivo."}),e.jsxs("li",{children:["Minimal API expõe CRUD com ",e.jsx("code",{children:"MapGet"}),"/",e.jsx("code",{children:"MapPost"}),"/",e.jsx("code",{children:"MapPut"}),"/",e.jsx("code",{children:"MapDelete"}),"."]}),e.jsxs("li",{children:["FluentValidation centraliza regras de entrada e devolve ",e.jsx("em",{children:"ValidationProblem"})," automaticamente."]}),e.jsx("li",{children:"Swagger UI dá documentação interativa em desenvolvimento."}),e.jsx("li",{children:"Dockerfile multi-stage gera imagem enxuta pronta para deploy em qualquer nuvem."}),e.jsx("li",{children:"Próximo passo natural: JWT, testes, migrations e observabilidade."})]})]})}export{s as default};
