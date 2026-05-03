import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OpenapiSwagger() {
  return (
    <PageContainer
      title="OpenAPI/Swagger: documentando sua API"
      subtitle="Descrição automática dos seus endpoints, com tela interativa para testar no navegador."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Imagine que você acabou de construir uma API REST com 40 endpoints e amanhã o time de front-end vai começar a consumi-la. Sem documentação, eles vão te mandar 200 mensagens no chat ("o que esse campo aceita?", "qual status code esse erro retorna?"). A solução é o <strong>OpenAPI</strong>, um padrão que descreve a sua API em JSON/YAML — quais rotas existem, parâmetros, schemas de request/response e códigos HTTP. <strong>Swagger</strong> é o nome histórico das ferramentas que leem esse JSON e geram interfaces visuais. Pense no OpenAPI como a "planta baixa" da API e no Swagger UI como a "maquete interativa".
      </p>

      <h2>O que veio no .NET 9: <code>AddOpenApi</code></h2>
      <p>
        A partir do .NET 9, o time da Microsoft incluiu suporte nativo para gerar o documento OpenAPI sem dependência externa. Antes disso (e ainda hoje, em projetos legados), o pacote padrão é o <strong>Swashbuckle.AspNetCore</strong>. Vamos ver os dois.
      </p>
      <pre><code>{`// .NET 9 — só o documento OpenAPI nativo (sem UI)
// dotnet add package Microsoft.AspNetCore.OpenApi
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi(); // registra geração do JSON
var app = builder.Build();
app.MapOpenApi(); // expõe em /openapi/v1.json
app.MapGet("/produtos", () => new[] { "café", "chá" });
app.Run();`}</code></pre>
      <p>
        Note que o <code>AddOpenApi</code> nativo só gera o <em>documento</em>. Ele não traz tela. Para a UI, você combina com <strong>Scalar</strong>, <strong>Swagger UI</strong> ou <strong>Redoc</strong> em pacotes separados.
      </p>

      <h2>Swashbuckle: o caminho clássico</h2>
      <pre><code>{`// dotnet add package Swashbuckle.AspNetCore
using Microsoft.OpenApi.Models;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API de Tarefas",
        Version = "v1",
        Description = "Permite criar, listar e concluir tarefas.",
        Contact = new OpenApiContact { Name = "Time Backend", Email = "dev@empresa.com" }
    });
    // habilita comentários XML (precisa do <GenerateDocumentationFile>true</...> no .csproj)
    var xml = Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml");
    if (File.Exists(xml)) c.IncludeXmlComments(xml);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();              // expõe /swagger/v1/swagger.json
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
        c.RoutePrefix = string.Empty; // UI direto na raiz
    });
}`}</code></pre>
      <p>
        Em desenvolvimento, abrir <code>https://localhost:5001/</code> agora mostra a Swagger UI: cada endpoint vira um cartão expansível, com botão "Try it out" que envia uma requisição real e mostra a resposta — extremamente útil para testar rapidamente sem Postman.
      </p>

      <AlertBox type="info" title="Por que XML doc comments?">
        Comentários <code>/// &lt;summary&gt;</code> em métodos e parâmetros viram automaticamente descrição na UI. É a forma mais barata de documentação que existe: você comenta o C# e o leitor da API ganha texto explicativo de graça.
      </AlertBox>

      <h2>Anotando endpoints</h2>
      <p>
        O Swashbuckle infere muito sozinho, mas você pode (e deve) ser explícito sobre status codes e tipos retornados. Isso aparece na UI <em>e</em> permite que clientes gerados (NSwag, openapi-generator) tipem corretamente os retornos.
      </p>
      <pre><code>{`/// <summary>Cria uma nova tarefa.</summary>
/// <param name="dto">Dados da tarefa.</param>
/// <response code="201">Tarefa criada com sucesso.</response>
/// <response code="400">Dados inválidos.</response>
[HttpPost]
[Consumes("application/json")]
[Produces("application/json")]
[ProducesResponseType(typeof(TarefaDto), StatusCodes.Status201Created)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
public async Task<IActionResult> Criar([FromBody] CriarTarefaDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Titulo))
        return BadRequest(new ProblemDetails { Title = "Título obrigatório" });
    var nova = await _service.CriarAsync(dto);
    return CreatedAtAction(nameof(Obter), new { id = nova.Id }, nova);
}`}</code></pre>
      <p>
        Em <strong>Minimal APIs</strong>, o equivalente fluente é:
      </p>
      <pre><code>{`app.MapPost("/tarefas", async (CriarTarefaDto dto, ITarefaService svc) =>
{
    var nova = await svc.CriarAsync(dto);
    return Results.Created($"/tarefas/{nova.Id}", nova);
})
.WithName("CriarTarefa")
.WithSummary("Cria uma nova tarefa.")
.Produces<TarefaDto>(StatusCodes.Status201Created)
.ProducesValidationProblem();`}</code></pre>

      <h2>Security definitions: JWT na UI</h2>
      <p>
        Se sua API usa autenticação por <strong>Bearer token</strong> (JWT), você quer que a Swagger UI tenha aquele botão "Authorize" no topo. Isso requer declarar o <em>security scheme</em>:
      </p>
      <pre><code>{`builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Cole o token JWT (sem o prefixo 'Bearer ')."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme, Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});`}</code></pre>
      <p>
        Agora todos os endpoints decorados com <code>[Authorize]</code> mostram um cadeado, e o "Authorize" no topo guarda o token entre chamadas — você cola uma vez e testa quantos endpoints quiser.
      </p>

      <AlertBox type="warning" title="Não exponha Swagger em produção sem cuidado">
        A documentação revela <em>todos</em> os endpoints, incluindo administrativos. Em produção, ou desabilite (<code>app.Environment.IsDevelopment()</code>), ou proteja a rota <code>/swagger</code> com autenticação. Vazar o schema completo facilita a vida de quem está procurando vulnerabilidades.
      </AlertBox>

      <h2>Geração de clientes</h2>
      <p>
        O <code>swagger.json</code> não serve só para humanos. Ferramentas como <strong>NSwag</strong>, <strong>Kiota</strong> (Microsoft) e <strong>openapi-generator</strong> leem o documento e geram clientes tipados em TypeScript, C#, Python, etc. Resultado: o front-end nunca chama um endpoint inexistente, e qualquer mudança no contrato gera erro de compilação imediato.
      </p>
      <pre><code>{`# Gera cliente TypeScript usando openapi-generator
npx @openapitools/openapi-generator-cli generate \\
  -i https://localhost:5001/swagger/v1/swagger.json \\
  -g typescript-fetch \\
  -o ./src/api`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>&lt;GenerateDocumentationFile&gt;true&lt;/...&gt;</code></strong> no .csproj — os comentários XML não aparecem.</li>
        <li><strong>Tipos de retorno <code>IActionResult</code> sem <code>[ProducesResponseType]</code></strong> — o Swagger marca tudo como <em>void</em>.</li>
        <li><strong>Schemas com referências circulares</strong> — a serialização entra em loop. Use DTOs achatados.</li>
        <li><strong>Versões diferentes do Swashbuckle</strong> em projetos do mesmo solution — gera conflito de assemblies.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>OpenAPI = padrão; Swagger UI = ferramenta que renderiza.</li>
        <li>.NET 9 traz <code>AddOpenApi</code> nativo; legado usa Swashbuckle.</li>
        <li>Anote endpoints com <code>[ProducesResponseType]</code> e XML comments.</li>
        <li>Configure <em>security definition</em> Bearer para testar APIs com JWT na UI.</li>
        <li>Use o JSON gerado para criar clientes tipados automaticamente.</li>
      </ul>
    </PageContainer>
  );
}
