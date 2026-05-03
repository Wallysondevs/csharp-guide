import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(a,{title:"OpenAPI/Swagger: documentando sua API",subtitle:"Descrição automática dos seus endpoints, com tela interativa para testar no navegador.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs("p",{children:['Imagine que você acabou de construir uma API REST com 40 endpoints e amanhã o time de front-end vai começar a consumi-la. Sem documentação, eles vão te mandar 200 mensagens no chat ("o que esse campo aceita?", "qual status code esse erro retorna?"). A solução é o ',e.jsx("strong",{children:"OpenAPI"}),", um padrão que descreve a sua API em JSON/YAML — quais rotas existem, parâmetros, schemas de request/response e códigos HTTP. ",e.jsx("strong",{children:"Swagger"}),' é o nome histórico das ferramentas que leem esse JSON e geram interfaces visuais. Pense no OpenAPI como a "planta baixa" da API e no Swagger UI como a "maquete interativa".']}),e.jsxs("h2",{children:["O que veio no .NET 9: ",e.jsx("code",{children:"AddOpenApi"})]}),e.jsxs("p",{children:["A partir do .NET 9, o time da Microsoft incluiu suporte nativo para gerar o documento OpenAPI sem dependência externa. Antes disso (e ainda hoje, em projetos legados), o pacote padrão é o ",e.jsx("strong",{children:"Swashbuckle.AspNetCore"}),". Vamos ver os dois."]}),e.jsx("pre",{children:e.jsx("code",{children:`// .NET 9 — só o documento OpenAPI nativo (sem UI)
// dotnet add package Microsoft.AspNetCore.OpenApi
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi(); // registra geração do JSON
var app = builder.Build();
app.MapOpenApi(); // expõe em /openapi/v1.json
app.MapGet("/produtos", () => new[] { "café", "chá" });
app.Run();`})}),e.jsxs("p",{children:["Note que o ",e.jsx("code",{children:"AddOpenApi"})," nativo só gera o ",e.jsx("em",{children:"documento"}),". Ele não traz tela. Para a UI, você combina com ",e.jsx("strong",{children:"Scalar"}),", ",e.jsx("strong",{children:"Swagger UI"})," ou ",e.jsx("strong",{children:"Redoc"})," em pacotes separados."]}),e.jsx("h2",{children:"Swashbuckle: o caminho clássico"}),e.jsx("pre",{children:e.jsx("code",{children:`// dotnet add package Swashbuckle.AspNetCore
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
}`})}),e.jsxs("p",{children:["Em desenvolvimento, abrir ",e.jsx("code",{children:"https://localhost:5001/"}),' agora mostra a Swagger UI: cada endpoint vira um cartão expansível, com botão "Try it out" que envia uma requisição real e mostra a resposta — extremamente útil para testar rapidamente sem Postman.']}),e.jsxs(o,{type:"info",title:"Por que XML doc comments?",children:["Comentários ",e.jsx("code",{children:"/// <summary>"})," em métodos e parâmetros viram automaticamente descrição na UI. É a forma mais barata de documentação que existe: você comenta o C# e o leitor da API ganha texto explicativo de graça."]}),e.jsx("h2",{children:"Anotando endpoints"}),e.jsxs("p",{children:["O Swashbuckle infere muito sozinho, mas você pode (e deve) ser explícito sobre status codes e tipos retornados. Isso aparece na UI ",e.jsx("em",{children:"e"})," permite que clientes gerados (NSwag, openapi-generator) tipem corretamente os retornos."]}),e.jsx("pre",{children:e.jsx("code",{children:`/// <summary>Cria uma nova tarefa.</summary>
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
}`})}),e.jsxs("p",{children:["Em ",e.jsx("strong",{children:"Minimal APIs"}),", o equivalente fluente é:"]}),e.jsx("pre",{children:e.jsx("code",{children:`app.MapPost("/tarefas", async (CriarTarefaDto dto, ITarefaService svc) =>
{
    var nova = await svc.CriarAsync(dto);
    return Results.Created($"/tarefas/{nova.Id}", nova);
})
.WithName("CriarTarefa")
.WithSummary("Cria uma nova tarefa.")
.Produces<TarefaDto>(StatusCodes.Status201Created)
.ProducesValidationProblem();`})}),e.jsx("h2",{children:"Security definitions: JWT na UI"}),e.jsxs("p",{children:["Se sua API usa autenticação por ",e.jsx("strong",{children:"Bearer token"}),' (JWT), você quer que a Swagger UI tenha aquele botão "Authorize" no topo. Isso requer declarar o ',e.jsx("em",{children:"security scheme"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddSwaggerGen(c =>
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
});`})}),e.jsxs("p",{children:["Agora todos os endpoints decorados com ",e.jsx("code",{children:"[Authorize]"}),' mostram um cadeado, e o "Authorize" no topo guarda o token entre chamadas — você cola uma vez e testa quantos endpoints quiser.']}),e.jsxs(o,{type:"warning",title:"Não exponha Swagger em produção sem cuidado",children:["A documentação revela ",e.jsx("em",{children:"todos"})," os endpoints, incluindo administrativos. Em produção, ou desabilite (",e.jsx("code",{children:"app.Environment.IsDevelopment()"}),"), ou proteja a rota ",e.jsx("code",{children:"/swagger"})," com autenticação. Vazar o schema completo facilita a vida de quem está procurando vulnerabilidades."]}),e.jsx("h2",{children:"Geração de clientes"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"swagger.json"})," não serve só para humanos. Ferramentas como ",e.jsx("strong",{children:"NSwag"}),", ",e.jsx("strong",{children:"Kiota"})," (Microsoft) e ",e.jsx("strong",{children:"openapi-generator"})," leem o documento e geram clientes tipados em TypeScript, C#, Python, etc. Resultado: o front-end nunca chama um endpoint inexistente, e qualquer mudança no contrato gera erro de compilação imediato."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Gera cliente TypeScript usando openapi-generator
npx @openapitools/openapi-generator-cli generate \\
  -i https://localhost:5001/swagger/v1/swagger.json \\
  -g typescript-fetch \\
  -o ./src/api`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"<GenerateDocumentationFile>true</...>"})]})," no .csproj — os comentários XML não aparecem."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tipos de retorno ",e.jsx("code",{children:"IActionResult"})," sem ",e.jsx("code",{children:"[ProducesResponseType]"})]})," — o Swagger marca tudo como ",e.jsx("em",{children:"void"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Schemas com referências circulares"})," — a serialização entra em loop. Use DTOs achatados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Versões diferentes do Swashbuckle"})," em projetos do mesmo solution — gera conflito de assemblies."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"OpenAPI = padrão; Swagger UI = ferramenta que renderiza."}),e.jsxs("li",{children:[".NET 9 traz ",e.jsx("code",{children:"AddOpenApi"})," nativo; legado usa Swashbuckle."]}),e.jsxs("li",{children:["Anote endpoints com ",e.jsx("code",{children:"[ProducesResponseType]"})," e XML comments."]}),e.jsxs("li",{children:["Configure ",e.jsx("em",{children:"security definition"})," Bearer para testar APIs com JWT na UI."]}),e.jsx("li",{children:"Use o JSON gerado para criar clientes tipados automaticamente."})]})]})}export{n as default};
