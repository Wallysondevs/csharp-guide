import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Routing() {
  return (
    <PageContainer
      title="Routing: do URL ao endpoint"
      subtitle="Entenda como o ASP.NET Core decide qual trecho de código deve responder a cada URL — com convenções, atributos, constraints e versionamento."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Quando uma requisição chega ao seu servidor com a URL <code>/api/v1/produtos/42</code>, alguém precisa decidir: "esse caminho é responsabilidade de qual método?". Esse "porteiro" é o <strong>Routing</strong> (roteamento). Ele recebe a URL, compara com um catálogo de rotas registradas, extrai parâmetros (como o <code>42</code>) e despacha para o endpoint certo. Pense nele como o GPS do seu app: a URL é o endereço, e o roteamento traça o caminho até o método que vai atender.
      </p>

      <h2>Os dois grandes estilos: convenção × atributos</h2>
      <p>
        Há duas formas de declarar rotas em ASP.NET Core:
      </p>
      <ul>
        <li><strong>Convencional:</strong> uma única "fórmula" mapeia automaticamente URL → controller → action. Comum em sites MVC clássicos com Views.</li>
        <li><strong>Por atributos:</strong> cada método declara explicitamente sua rota com <code>[HttpGet("...")]</code>. É a forma idiomática para APIs REST.</li>
      </ul>
      <pre><code>{`// Roteamento convencional (MVC com Views)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Resultado: /Produtos/Detalhe/5 → ProdutosController.Detalhe(id: 5)
// /Home/Index → HomeController.Index()  (defaults)`}</code></pre>

      <h2>Attribute routing: poder e clareza</h2>
      <p>
        Em APIs, prefira atributos. Cada endpoint diz <em>exatamente</em> qual URL responde:
      </p>
      <pre><code>{`[ApiController]
[Route("api/v1/[controller]")]   // [controller] = "produtos"
public class ProdutosController : ControllerBase
{
    [HttpGet]                          // GET    /api/v1/produtos
    public IActionResult Listar() => Ok();

    [HttpGet("{id:int}")]              // GET    /api/v1/produtos/42
    public IActionResult Obter(int id) => Ok(id);

    [HttpGet("destaque")]              // GET    /api/v1/produtos/destaque
    public IActionResult Destaque() => Ok();

    [HttpPost]                         // POST   /api/v1/produtos
    public IActionResult Criar() => Created("", null);

    [HttpDelete("{id:int}")]           // DELETE /api/v1/produtos/42
    public IActionResult Remover(int id) => NoContent();
}`}</code></pre>
      <p>
        O <code>[Route]</code> aplicado na classe define o <em>prefixo</em>; o <code>[HttpGet("…")]</code> dos métodos define o sufixo. O token <code>[controller]</code> é substituído pelo nome da classe sem o sufixo "Controller".
      </p>

      <h2>Constraints: restringindo o formato dos parâmetros</h2>
      <p>
        Constraints fazem parte do roteador rejeitar URLs que não casam com o tipo esperado — antes mesmo de chamar seu código:
      </p>
      <pre><code>{`[HttpGet("{id:int}")]              // só aceita inteiro positivo ou negativo
[HttpGet("{slug:alpha}")]          // só letras
[HttpGet("{nome:minlength(3)}")]   // mínimo 3 caracteres
[HttpGet("{ano:int:range(1900,2100)}")]
[HttpGet("{guid:guid}")]           // GUID válido
[HttpGet("{data:datetime}")]       // ISO 8601`}</code></pre>
      <p>
        Sem constraint, <code>{`{id}`}</code> aceita qualquer string — você precisaria converter manualmente. Com <code>{`{id:int}`}</code>, se vier <code>/produtos/abc</code>, o framework devolve 404 sem perda de tempo.
      </p>

      <h2>Route values e binding</h2>
      <p>
        Os pedaços que casam com <code>{`{...}`}</code> ficam disponíveis em <code>RouteData.Values</code> e são automaticamente vinculados aos parâmetros do método com nomes iguais:
      </p>
      <pre><code>{`[HttpGet("usuarios/{userId:int}/pedidos/{pedidoId:int}")]
public IActionResult Obter(int userId, int pedidoId)
{
    // userId e pedidoId vêm direto da URL
    return Ok(new { userId, pedidoId });
}

// Acessando manualmente (raro):
var slug = RouteData.Values["slug"]?.ToString();`}</code></pre>

      <h2>Tag Helpers: gerando URLs no Razor</h2>
      <p>
        No mundo MVC/Razor Pages, em vez de escrever URLs hardcoded, use os <em>tag helpers</em> <code>asp-action</code>, <code>asp-controller</code> e <code>asp-route-*</code>:
      </p>
      <pre><code>{`<a asp-controller="Produtos"
   asp-action="Detalhe"
   asp-route-id="42"
   class="btn">
    Ver detalhe
</a>

<!-- Renderiza: <a href="/Produtos/Detalhe/42" class="btn"> -->

<form asp-action="Salvar" method="post">
    @* O href/action é gerado pelo roteador, em conformidade com as rotas atuais *@
</form>`}</code></pre>
      <p>
        A vantagem: se você renomear uma rota (mudar prefixo, adicionar versionamento), os links são reescritos automaticamente — sem caçar URLs no projeto inteiro.
      </p>

      <h2>MapGroup: agrupando endpoints (Minimal API)</h2>
      <p>
        Em Minimal APIs, <code>MapGroup</code> aplica prefixos e políticas comuns a um grupo de endpoints, evitando repetição:
      </p>
      <pre><code>{`var v1 = app.MapGroup("/api/v1")
            .WithTags("V1")
            .WithOpenApi();

var produtos = v1.MapGroup("/produtos")
                 .RequireAuthorization();   // só logados

produtos.MapGet("/", ListarProdutos);
produtos.MapGet("/{id:int}", ObterProduto);
produtos.MapPost("/", CriarProduto)
        .RequireAuthorization("AdminPolicy"); // sobrescreve política só aqui`}</code></pre>

      <AlertBox type="info" title="Roteamento é resolvido em ordem de especificidade">
        Quando duas rotas casam com a mesma URL, vence a mais <em>específica</em>: <code>/produtos/destaque</code> ganha de <code>/produtos/{`{id}`}</code>. O ASP.NET tem regras claras de desempate; em caso de ambiguidade real, ele lança exceção em runtime.
      </AlertBox>

      <h2>Versionamento de API</h2>
      <p>
        APIs evoluem; quebrar clientes antigos é proibido. Use o pacote <code>Asp.Versioning.Mvc</code> (instale com <code>dotnet add package Asp.Versioning.Mvc</code>) para versionar:
      </p>
      <pre><code>{`builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    // Versão pode vir da URL, header ou query string
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version"),
        new QueryStringApiVersionReader("v"));
});

[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/produtos")]
public class ProdutosController : ControllerBase
{
    [HttpGet, MapToApiVersion("1.0")]
    public IActionResult ListarV1() => Ok("v1");

    [HttpGet, MapToApiVersion("2.0")]
    public IActionResult ListarV2() => Ok("v2 com paginação");
}`}</code></pre>

      <h2>Endpoint metadata e descobrindo rotas em runtime</h2>
      <p>
        Você pode listar todos os endpoints registrados — útil para gerar documentação ou debugar:
      </p>
      <pre><code>{`app.MapGet("/_rotas", (IEnumerable<EndpointDataSource> sources) =>
{
    var rotas = sources.SelectMany(s => s.Endpoints)
        .OfType<RouteEndpoint>()
        .Select(e => new
        {
            Pattern = e.RoutePattern.RawText,
            Methods = e.Metadata
                .OfType<HttpMethodMetadata>()
                .FirstOrDefault()?.HttpMethods
        });
    return Results.Ok(rotas);
});`}</code></pre>

      <AlertBox type="warning" title="Cuidado com rotas conflitantes">
        Duas rotas com o mesmo padrão e mesmo método HTTP causam <code>AmbiguousMatchException</code> em runtime — mas só quando alguém acessa. Em apps grandes, escreva testes de smoke que pinguem cada endpoint para detectar conflitos cedo.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer constraint <code>:int</code></strong> e receber strings onde se esperava número.</li>
        <li><strong>Conflitar rota literal com parâmetro:</strong> <code>/produtos/destaque</code> e <code>/produtos/{`{slug}`}</code> coexistem, mas em outros casos podem ambiguar.</li>
        <li><strong>Esquecer <code>app.UseRouting()</code></strong> (em apps complexos com middlewares manuais) — endpoints param de funcionar.</li>
        <li><strong>Hardcodar URLs nos Views</strong> em vez de usar tag helpers — quebra ao mudar rota.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Roteamento associa URLs a métodos via <strong>convenção</strong> ou <strong>atributos</strong>.</li>
        <li>APIs preferem atributos: <code>[Route]</code>, <code>[HttpGet("…")]</code>.</li>
        <li><strong>Constraints</strong> (<code>:int</code>, <code>:guid</code>, <code>:range</code>) filtram URLs antes do código rodar.</li>
        <li><strong>MapGroup</strong> evita repetição em Minimal APIs.</li>
        <li>Tag helpers <code>asp-action</code>/<code>asp-route-*</code> geram URLs em Razor sem hardcode.</li>
        <li>Versionamento via pacote <code>Asp.Versioning.Mvc</code> permite evolução sem quebra.</li>
      </ul>
    </PageContainer>
  );
}
