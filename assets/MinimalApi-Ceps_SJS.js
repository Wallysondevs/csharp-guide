import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"Minimal APIs: criar uma API REST em 10 linhas",subtitle:"Aprenda a expor endpoints HTTP em C# usando o estilo mais enxuto e moderno do ASP.NET Core.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:['Antes de 2021, criar uma API em ASP.NET exigia muita "cerimônia": classes ',e.jsx("em",{children:"Controller"}),", atributos, namespaces, arquivo ",e.jsx("code",{children:"Startup.cs"}),". Boa para projetos grandes, mas exagerada para um microsserviço de 3 endpoints. As ",e.jsx("strong",{children:"Minimal APIs"})," resolveram isso: você descreve a API como uma lista de funções pequenas — quase como no Express (Node) ou no Flask (Python). É a forma mais rápida de sair do zero a um JSON respondendo no navegador."]}),e.jsx("h2",{children:"O esqueleto mínimo"}),e.jsxs("p",{children:["Crie um projeto vazio com ",e.jsx("code",{children:"dotnet new web -n MinhaApi"})," e abra o arquivo ",e.jsx("code",{children:"Program.cs"}),". O template já vem assim:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Olá, API!");

app.Run();`})}),e.jsxs("p",{children:["Quatro linhas e você tem um servidor HTTP rodando. ",e.jsx("code",{children:"WebApplication.CreateBuilder"}),' prepara o "construtor" da aplicação — onde você registra serviços e lê configurações. ',e.jsx("code",{children:"builder.Build()"})," finaliza essa preparação e devolve o objeto ",e.jsx("code",{children:"app"}),", que é o servidor pronto para receber rotas. ",e.jsx("code",{children:"app.Run()"})," entrega o controle ao Kestrel."]}),e.jsx("h2",{children:"Mapeando os verbos HTTP"}),e.jsxs("p",{children:["REST gira em torno de ",e.jsx("strong",{children:"verbos HTTP"}),": ",e.jsx("code",{children:"GET"})," para ler, ",e.jsx("code",{children:"POST"})," para criar, ",e.jsx("code",{children:"PUT"}),"/",e.jsx("code",{children:"PATCH"})," para atualizar e ",e.jsx("code",{children:"DELETE"})," para remover. Cada um tem um método ",e.jsx("code",{children:"Map*"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var produtos = new List<Produto>();

// Listar todos
app.MapGet("/produtos", () => produtos);

// Buscar um por id (parâmetro de rota entre chaves)
app.MapGet("/produtos/{id:int}", (int id) =>
{
    var p = produtos.FirstOrDefault(x => x.Id == id);
    return p is null ? Results.NotFound() : Results.Ok(p);
});

// Criar (recebe JSON no corpo)
app.MapPost("/produtos", (Produto novo) =>
{
    novo.Id = produtos.Count + 1;
    produtos.Add(novo);
    return Results.Created($"/produtos/{novo.Id}", novo);
});

// Remover
app.MapDelete("/produtos/{id:int}", (int id) =>
{
    produtos.RemoveAll(p => p.Id == id);
    return Results.NoContent();
});

record Produto(int Id, string Nome, decimal Preco)
{
    public int Id { get; set; } = Id;
}`})}),e.jsxs("p",{children:["Note como o C# faz ",e.jsx("strong",{children:"binding automático"}),": o ",e.jsx("code",{children:"int id"})," vem da URL, o objeto ",e.jsx("code",{children:"Produto"})," vem desserializado do JSON do corpo. A classe ",e.jsx("code",{children:"Results"})," oferece atalhos para os códigos HTTP comuns: ",e.jsx("code",{children:"Ok(obj)"})," = 200, ",e.jsx("code",{children:"Created(...)"})," = 201, ",e.jsx("code",{children:"NoContent()"})," = 204, ",e.jsx("code",{children:"NotFound()"})," = 404, ",e.jsx("code",{children:"BadRequest(...)"})," = 400."]}),e.jsx("h2",{children:"Parâmetros de rota, query e header"}),e.jsxs("p",{children:["ASP.NET Core decide de onde vem cada parâmetro pela ",e.jsx("em",{children:"posição"})," na URL e por convenções:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// /buscar/livros?autor=Tolkien&pagina=2
app.MapGet("/buscar/{categoria}", (
    string categoria,           // vem da rota
    string? autor,              // vem da query string
    int pagina = 1              // query com default
) =>
{
    return new { categoria, autor, pagina };
});

// Para forçar a origem, use atributos:
app.MapGet("/headers", ([FromHeader(Name = "X-Api-Key")] string apiKey)
    => $"Sua chave: {apiKey}");`})}),e.jsxs("p",{children:["As ",e.jsx("strong",{children:"constraints"})," como ",e.jsx("code",{children:"{id:int}"})," dizem ao roteador que o parâmetro deve ser um inteiro — se o usuário enviar ",e.jsx("code",{children:"/produtos/abc"}),", o framework devolve 404 sem nem chamar seu código."]}),e.jsxs(r,{type:"info",title:"Records são perfeitos para DTOs",children:["Em vez de criar uma classe cheia de propriedades, use ",e.jsx("code",{children:"record"}),". A linha ",e.jsx("code",{children:"public record Produto(int Id, string Nome, decimal Preco);"})," gera construtor, propriedades imutáveis, ",e.jsx("code",{children:"Equals"})," e ",e.jsx("code",{children:"ToString"})," automaticamente. Veja o capítulo de Records para detalhes."]}),e.jsx("h2",{children:"OpenAPI/Swagger automático"}),e.jsxs("p",{children:[e.jsx("strong",{children:"OpenAPI"})," (antigo Swagger) é um padrão para descrever APIs em JSON. A partir do .NET 9, o ASP.NET gera essa documentação sozinho:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi(); // adiciona o gerador

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();          // expõe /openapi/v1.json
}

app.MapGet("/hello", () => "oi")
   .WithName("HelloEndpoint")  // nome para a documentação
   .WithSummary("Diz oi")
   .WithTags("Diversos");

app.Run();`})}),e.jsxs("p",{children:["Ao acessar ",e.jsx("code",{children:"http://localhost:5000/openapi/v1.json"})," você verá toda a API descrita — pronta para consumir em ferramentas como Postman, Insomnia, Scalar ou Swagger UI. Frontends podem gerar clientes TypeScript automaticamente a partir desse arquivo."]}),e.jsxs("h2",{children:["Agrupando rotas com ",e.jsx("code",{children:"MapGroup"})]}),e.jsxs("p",{children:["Quando a API cresce, é chato repetir ",e.jsx("code",{children:"/api/v1/produtos"})," em cada linha. Use grupos:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var produtos = app.MapGroup("/api/v1/produtos")
                  .RequireAuthorization()       // todos exigem login
                  .WithTags("Produtos");

produtos.MapGet("/", () => Repo.Listar());
produtos.MapGet("/{id:int}", (int id) => Repo.Obter(id));
produtos.MapPost("/", (Produto p) => Repo.Criar(p));`})}),e.jsx("h2",{children:"Quando NÃO usar Minimal APIs?"}),e.jsxs("p",{children:["Minimal APIs são fantásticas para microsserviços e BFFs (Backend for Frontend). Mas quando o projeto cresce muito (50+ endpoints, validações complexas, filtros de exceção, versionamento avançado), a estrutura organizada de ",e.jsx("strong",{children:"MVC Controllers"})," com classes, atributos e DI por construtor tende a se manter mais legível. A boa notícia: dá para misturar os dois no mesmo app."]}),e.jsxs(r,{type:"warning",title:"Cuidado com lambdas grandes",children:["Não escreva 100 linhas de lógica dentro do ",e.jsx("code",{children:"app.MapPost"}),". Extraia para um método estático ou uma classe de serviço. O lambda do endpoint deve ",e.jsx("em",{children:"orquestrar"}),", não ",e.jsx("em",{children:"implementar"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"app.Run()"}),":"]})," o programa termina sem servir nada."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trocar a ordem de parâmetros:"})," ",e.jsx("code",{children:"(int id, Produto novo)"})," em ",e.jsx("code",{children:'MapPost("/{id}")'})," funciona, mas se você inverter, o framework tenta achar o ",e.jsx("code",{children:"id"})," no corpo e quebra."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Retornar entidades EF Core diretamente"})," com referências cíclicas — gera erro de serialização. Use DTOs (",e.jsx("code",{children:"record"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer constraints de tipo:"})," ",e.jsx("code",{children:"{id}"})," aceita qualquer string; ",e.jsx("code",{children:"{id:int}"})," garante inteiro."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Minimal APIs permitem expor endpoints HTTP com poucas linhas de código."}),e.jsxs("li",{children:[e.jsx("code",{children:"MapGet"}),", ",e.jsx("code",{children:"MapPost"}),", ",e.jsx("code",{children:"MapPut"}),", ",e.jsx("code",{children:"MapDelete"})," mapeiam verbos HTTP."]}),e.jsx("li",{children:"Parâmetros vêm automaticamente da rota, query, header ou corpo."}),e.jsxs("li",{children:[e.jsx("code",{children:"Results.*"})," oferece atalhos para os códigos HTTP padrão."]}),e.jsxs("li",{children:[e.jsx("code",{children:"AddOpenApi()"})," + ",e.jsx("code",{children:"MapOpenApi()"})," geram documentação automática."]}),e.jsxs("li",{children:[e.jsx("code",{children:"MapGroup"})," organiza rotas com prefixo e políticas comuns."]})]})]})}export{i as default};
