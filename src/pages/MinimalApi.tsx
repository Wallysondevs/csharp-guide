import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MinimalApi() {
  return (
    <PageContainer
      title="Minimal APIs: criar uma API REST em 10 linhas"
      subtitle="Aprenda a expor endpoints HTTP em C# usando o estilo mais enxuto e moderno do ASP.NET Core."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Antes de 2021, criar uma API em ASP.NET exigia muita "cerimônia": classes <em>Controller</em>, atributos, namespaces, arquivo <code>Startup.cs</code>. Boa para projetos grandes, mas exagerada para um microsserviço de 3 endpoints. As <strong>Minimal APIs</strong> resolveram isso: você descreve a API como uma lista de funções pequenas — quase como no Express (Node) ou no Flask (Python). É a forma mais rápida de sair do zero a um JSON respondendo no navegador.
      </p>

      <h2>O esqueleto mínimo</h2>
      <p>
        Crie um projeto vazio com <code>dotnet new web -n MinhaApi</code> e abra o arquivo <code>Program.cs</code>. O template já vem assim:
      </p>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Olá, API!");

app.Run();`}</code></pre>
      <p>
        Quatro linhas e você tem um servidor HTTP rodando. <code>WebApplication.CreateBuilder</code> prepara o "construtor" da aplicação — onde você registra serviços e lê configurações. <code>builder.Build()</code> finaliza essa preparação e devolve o objeto <code>app</code>, que é o servidor pronto para receber rotas. <code>app.Run()</code> entrega o controle ao Kestrel.
      </p>

      <h2>Mapeando os verbos HTTP</h2>
      <p>
        REST gira em torno de <strong>verbos HTTP</strong>: <code>GET</code> para ler, <code>POST</code> para criar, <code>PUT</code>/<code>PATCH</code> para atualizar e <code>DELETE</code> para remover. Cada um tem um método <code>Map*</code>:
      </p>
      <pre><code>{`var produtos = new List<Produto>();

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
}`}</code></pre>
      <p>
        Note como o C# faz <strong>binding automático</strong>: o <code>int id</code> vem da URL, o objeto <code>Produto</code> vem desserializado do JSON do corpo. A classe <code>Results</code> oferece atalhos para os códigos HTTP comuns: <code>Ok(obj)</code> = 200, <code>Created(...)</code> = 201, <code>NoContent()</code> = 204, <code>NotFound()</code> = 404, <code>BadRequest(...)</code> = 400.
      </p>

      <h2>Parâmetros de rota, query e header</h2>
      <p>
        ASP.NET Core decide de onde vem cada parâmetro pela <em>posição</em> na URL e por convenções:
      </p>
      <pre><code>{`// /buscar/livros?autor=Tolkien&pagina=2
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
    => $"Sua chave: {apiKey}");`}</code></pre>
      <p>
        As <strong>constraints</strong> como <code>{`{id:int}`}</code> dizem ao roteador que o parâmetro deve ser um inteiro — se o usuário enviar <code>/produtos/abc</code>, o framework devolve 404 sem nem chamar seu código.
      </p>

      <AlertBox type="info" title="Records são perfeitos para DTOs">
        Em vez de criar uma classe cheia de propriedades, use <code>record</code>. A linha <code>public record Produto(int Id, string Nome, decimal Preco);</code> gera construtor, propriedades imutáveis, <code>Equals</code> e <code>ToString</code> automaticamente. Veja o capítulo de Records para detalhes.
      </AlertBox>

      <h2>OpenAPI/Swagger automático</h2>
      <p>
        <strong>OpenAPI</strong> (antigo Swagger) é um padrão para descrever APIs em JSON. A partir do .NET 9, o ASP.NET gera essa documentação sozinho:
      </p>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);
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

app.Run();`}</code></pre>
      <p>
        Ao acessar <code>http://localhost:5000/openapi/v1.json</code> você verá toda a API descrita — pronta para consumir em ferramentas como Postman, Insomnia, Scalar ou Swagger UI. Frontends podem gerar clientes TypeScript automaticamente a partir desse arquivo.
      </p>

      <h2>Agrupando rotas com <code>MapGroup</code></h2>
      <p>
        Quando a API cresce, é chato repetir <code>/api/v1/produtos</code> em cada linha. Use grupos:
      </p>
      <pre><code>{`var produtos = app.MapGroup("/api/v1/produtos")
                  .RequireAuthorization()       // todos exigem login
                  .WithTags("Produtos");

produtos.MapGet("/", () => Repo.Listar());
produtos.MapGet("/{id:int}", (int id) => Repo.Obter(id));
produtos.MapPost("/", (Produto p) => Repo.Criar(p));`}</code></pre>

      <h2>Quando NÃO usar Minimal APIs?</h2>
      <p>
        Minimal APIs são fantásticas para microsserviços e BFFs (Backend for Frontend). Mas quando o projeto cresce muito (50+ endpoints, validações complexas, filtros de exceção, versionamento avançado), a estrutura organizada de <strong>MVC Controllers</strong> com classes, atributos e DI por construtor tende a se manter mais legível. A boa notícia: dá para misturar os dois no mesmo app.
      </p>

      <AlertBox type="warning" title="Cuidado com lambdas grandes">
        Não escreva 100 linhas de lógica dentro do <code>app.MapPost</code>. Extraia para um método estático ou uma classe de serviço. O lambda do endpoint deve <em>orquestrar</em>, não <em>implementar</em>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>app.Run()</code>:</strong> o programa termina sem servir nada.</li>
        <li><strong>Trocar a ordem de parâmetros:</strong> <code>(int id, Produto novo)</code> em <code>MapPost("/&#123;id&#125;")</code> funciona, mas se você inverter, o framework tenta achar o <code>id</code> no corpo e quebra.</li>
        <li><strong>Retornar entidades EF Core diretamente</strong> com referências cíclicas — gera erro de serialização. Use DTOs (<code>record</code>).</li>
        <li><strong>Esquecer constraints de tipo:</strong> <code>{`{id}`}</code> aceita qualquer string; <code>{`{id:int}`}</code> garante inteiro.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Minimal APIs permitem expor endpoints HTTP com poucas linhas de código.</li>
        <li><code>MapGet</code>, <code>MapPost</code>, <code>MapPut</code>, <code>MapDelete</code> mapeiam verbos HTTP.</li>
        <li>Parâmetros vêm automaticamente da rota, query, header ou corpo.</li>
        <li><code>Results.*</code> oferece atalhos para os códigos HTTP padrão.</li>
        <li><code>AddOpenApi()</code> + <code>MapOpenApi()</code> geram documentação automática.</li>
        <li><code>MapGroup</code> organiza rotas com prefixo e políticas comuns.</li>
      </ul>
    </PageContainer>
  );
}
