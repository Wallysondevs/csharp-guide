import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function t(){return e.jsxs(s,{title:"Routing: do URL ao endpoint",subtitle:"Entenda como o ASP.NET Core decide qual trecho de código deve responder a cada URL — com convenções, atributos, constraints e versionamento.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Quando uma requisição chega ao seu servidor com a URL ",e.jsx("code",{children:"/api/v1/produtos/42"}),', alguém precisa decidir: "esse caminho é responsabilidade de qual método?". Esse "porteiro" é o ',e.jsx("strong",{children:"Routing"})," (roteamento). Ele recebe a URL, compara com um catálogo de rotas registradas, extrai parâmetros (como o ",e.jsx("code",{children:"42"}),") e despacha para o endpoint certo. Pense nele como o GPS do seu app: a URL é o endereço, e o roteamento traça o caminho até o método que vai atender."]}),e.jsx("h2",{children:"Os dois grandes estilos: convenção × atributos"}),e.jsx("p",{children:"Há duas formas de declarar rotas em ASP.NET Core:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Convencional:"}),' uma única "fórmula" mapeia automaticamente URL → controller → action. Comum em sites MVC clássicos com Views.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Por atributos:"})," cada método declara explicitamente sua rota com ",e.jsx("code",{children:'[HttpGet("...")]'}),". É a forma idiomática para APIs REST."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Roteamento convencional (MVC com Views)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Resultado: /Produtos/Detalhe/5 → ProdutosController.Detalhe(id: 5)
// /Home/Index → HomeController.Index()  (defaults)`})}),e.jsx("h2",{children:"Attribute routing: poder e clareza"}),e.jsxs("p",{children:["Em APIs, prefira atributos. Cada endpoint diz ",e.jsx("em",{children:"exatamente"})," qual URL responde:"]}),e.jsx("pre",{children:e.jsx("code",{children:`[ApiController]
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
}`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"[Route]"})," aplicado na classe define o ",e.jsx("em",{children:"prefixo"}),"; o ",e.jsx("code",{children:'[HttpGet("…")]'})," dos métodos define o sufixo. O token ",e.jsx("code",{children:"[controller]"}),' é substituído pelo nome da classe sem o sufixo "Controller".']}),e.jsx("h2",{children:"Constraints: restringindo o formato dos parâmetros"}),e.jsx("p",{children:"Constraints fazem parte do roteador rejeitar URLs que não casam com o tipo esperado — antes mesmo de chamar seu código:"}),e.jsx("pre",{children:e.jsx("code",{children:`[HttpGet("{id:int}")]              // só aceita inteiro positivo ou negativo
[HttpGet("{slug:alpha}")]          // só letras
[HttpGet("{nome:minlength(3)}")]   // mínimo 3 caracteres
[HttpGet("{ano:int:range(1900,2100)}")]
[HttpGet("{guid:guid}")]           // GUID válido
[HttpGet("{data:datetime}")]       // ISO 8601`})}),e.jsxs("p",{children:["Sem constraint, ",e.jsx("code",{children:"{id}"})," aceita qualquer string — você precisaria converter manualmente. Com ",e.jsx("code",{children:"{id:int}"}),", se vier ",e.jsx("code",{children:"/produtos/abc"}),", o framework devolve 404 sem perda de tempo."]}),e.jsx("h2",{children:"Route values e binding"}),e.jsxs("p",{children:["Os pedaços que casam com ",e.jsx("code",{children:"{...}"})," ficam disponíveis em ",e.jsx("code",{children:"RouteData.Values"})," e são automaticamente vinculados aos parâmetros do método com nomes iguais:"]}),e.jsx("pre",{children:e.jsx("code",{children:`[HttpGet("usuarios/{userId:int}/pedidos/{pedidoId:int}")]
public IActionResult Obter(int userId, int pedidoId)
{
    // userId e pedidoId vêm direto da URL
    return Ok(new { userId, pedidoId });
}

// Acessando manualmente (raro):
var slug = RouteData.Values["slug"]?.ToString();`})}),e.jsx("h2",{children:"Tag Helpers: gerando URLs no Razor"}),e.jsxs("p",{children:["No mundo MVC/Razor Pages, em vez de escrever URLs hardcoded, use os ",e.jsx("em",{children:"tag helpers"})," ",e.jsx("code",{children:"asp-action"}),", ",e.jsx("code",{children:"asp-controller"})," e ",e.jsx("code",{children:"asp-route-*"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`<a asp-controller="Produtos"
   asp-action="Detalhe"
   asp-route-id="42"
   class="btn">
    Ver detalhe
</a>

<!-- Renderiza: <a href="/Produtos/Detalhe/42" class="btn"> -->

<form asp-action="Salvar" method="post">
    @* O href/action é gerado pelo roteador, em conformidade com as rotas atuais *@
</form>`})}),e.jsx("p",{children:"A vantagem: se você renomear uma rota (mudar prefixo, adicionar versionamento), os links são reescritos automaticamente — sem caçar URLs no projeto inteiro."}),e.jsx("h2",{children:"MapGroup: agrupando endpoints (Minimal API)"}),e.jsxs("p",{children:["Em Minimal APIs, ",e.jsx("code",{children:"MapGroup"})," aplica prefixos e políticas comuns a um grupo de endpoints, evitando repetição:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var v1 = app.MapGroup("/api/v1")
            .WithTags("V1")
            .WithOpenApi();

var produtos = v1.MapGroup("/produtos")
                 .RequireAuthorization();   // só logados

produtos.MapGet("/", ListarProdutos);
produtos.MapGet("/{id:int}", ObterProduto);
produtos.MapPost("/", CriarProduto)
        .RequireAuthorization("AdminPolicy"); // sobrescreve política só aqui`})}),e.jsxs(o,{type:"info",title:"Roteamento é resolvido em ordem de especificidade",children:["Quando duas rotas casam com a mesma URL, vence a mais ",e.jsx("em",{children:"específica"}),": ",e.jsx("code",{children:"/produtos/destaque"})," ganha de ",e.jsxs("code",{children:["/produtos/","{id}"]}),". O ASP.NET tem regras claras de desempate; em caso de ambiguidade real, ele lança exceção em runtime."]}),e.jsx("h2",{children:"Versionamento de API"}),e.jsxs("p",{children:["APIs evoluem; quebrar clientes antigos é proibido. Use o pacote ",e.jsx("code",{children:"Asp.Versioning.Mvc"})," (instale com ",e.jsx("code",{children:"dotnet add package Asp.Versioning.Mvc"}),") para versionar:"]}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddApiVersioning(options =>
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
}`})}),e.jsx("h2",{children:"Endpoint metadata e descobrindo rotas em runtime"}),e.jsx("p",{children:"Você pode listar todos os endpoints registrados — útil para gerar documentação ou debugar:"}),e.jsx("pre",{children:e.jsx("code",{children:`app.MapGet("/_rotas", (IEnumerable<EndpointDataSource> sources) =>
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
});`})}),e.jsxs(o,{type:"warning",title:"Cuidado com rotas conflitantes",children:["Duas rotas com o mesmo padrão e mesmo método HTTP causam ",e.jsx("code",{children:"AmbiguousMatchException"})," em runtime — mas só quando alguém acessa. Em apps grandes, escreva testes de smoke que pinguem cada endpoint para detectar conflitos cedo."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer constraint ",e.jsx("code",{children:":int"})]})," e receber strings onde se esperava número."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Conflitar rota literal com parâmetro:"})," ",e.jsx("code",{children:"/produtos/destaque"})," e ",e.jsxs("code",{children:["/produtos/","{slug}"]})," coexistem, mas em outros casos podem ambiguar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"app.UseRouting()"})]})," (em apps complexos com middlewares manuais) — endpoints param de funcionar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hardcodar URLs nos Views"})," em vez de usar tag helpers — quebra ao mudar rota."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Roteamento associa URLs a métodos via ",e.jsx("strong",{children:"convenção"})," ou ",e.jsx("strong",{children:"atributos"}),"."]}),e.jsxs("li",{children:["APIs preferem atributos: ",e.jsx("code",{children:"[Route]"}),", ",e.jsx("code",{children:'[HttpGet("…")]'}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Constraints"})," (",e.jsx("code",{children:":int"}),", ",e.jsx("code",{children:":guid"}),", ",e.jsx("code",{children:":range"}),") filtram URLs antes do código rodar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MapGroup"})," evita repetição em Minimal APIs."]}),e.jsxs("li",{children:["Tag helpers ",e.jsx("code",{children:"asp-action"}),"/",e.jsx("code",{children:"asp-route-*"})," geram URLs em Razor sem hardcode."]}),e.jsxs("li",{children:["Versionamento via pacote ",e.jsx("code",{children:"Asp.Versioning.Mvc"})," permite evolução sem quebra."]})]})]})}export{t as default};
