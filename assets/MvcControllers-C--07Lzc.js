import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(r,{title:"MVC Controllers: estrutura clássica para APIs grandes",subtitle:"Aprenda o estilo organizado em classes do ASP.NET Core, ideal para APIs que vão crescer com dezenas de endpoints e regras.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Se as Minimal APIs são como um caderninho de anotações onde você joga tudo na ordem que pensa, os ",e.jsx("strong",{children:"Controllers"}),' são a pasta-arquivo bem organizada do escritório: cada Controller é uma classe que agrupa endpoints relacionados (todos os de "Produtos", todos os de "Usuários" etc.). Para projetos grandes, essa organização vale ouro — facilita encontrar, testar e revisar código.']}),e.jsx("h2",{children:'O que significa "MVC"'}),e.jsxs("p",{children:[e.jsx("strong",{children:"MVC"})," é a sigla de ",e.jsx("em",{children:"Model-View-Controller"}),", um padrão de arquitetura criado nos anos 1970. A ideia: separar os ",e.jsx("strong",{children:"dados"})," (Model), a ",e.jsx("strong",{children:"apresentação"})," (View) e o ",e.jsx("strong",{children:"fluxo de decisões"}),' (Controller). Em uma API JSON pura, a "View" praticamente desaparece — o que sobra são Models (classes/records que descrevem dados) e Controllers (classes que recebem requisições e devolvem respostas).']}),e.jsx("h2",{children:"Habilitando Controllers no projeto"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"Program.cs"})," você precisa registrar o serviço e mapear os endpoints:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var builder = WebApplication.CreateBuilder(args);

// 1. Registra a infraestrutura de Controllers
builder.Services.AddControllers();

var app = builder.Build();

// 2. Liga o roteamento por atributos para Controllers
app.MapControllers();

app.Run();`})}),e.jsxs("p",{children:["Sem o ",e.jsx("code",{children:"AddControllers()"})," o framework não sabe que você quer usar esse estilo; sem o ",e.jsx("code",{children:"MapControllers()"})," as rotas dos Controllers nunca são publicadas."]}),e.jsx("h2",{children:"Anatomia de um Controller"}),e.jsxs("p",{children:["Um Controller é uma classe pública que herda de ",e.jsx("code",{children:"ControllerBase"})," (use ",e.jsx("code",{children:"Controller"})," só se for renderizar HTML). Por convenção, fica em ",e.jsx("code",{children:"Controllers/ProdutosController.cs"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.AspNetCore.Mvc;

namespace MinhaApi.Controllers;

[ApiController]                    // Habilita comportamentos REST
[Route("api/v1/[controller]")]     // [controller] vira "produtos"
public class ProdutosController : ControllerBase
{
    private static readonly List<Produto> _banco = new();

    [HttpGet]                       // GET /api/v1/produtos
    public ActionResult<IEnumerable<Produto>> Listar()
    {
        return Ok(_banco);
    }

    [HttpGet("{id:int}")]           // GET /api/v1/produtos/42
    public ActionResult<Produto> Obter(int id)
    {
        var p = _banco.FirstOrDefault(x => x.Id == id);
        if (p is null) return NotFound();
        return Ok(p);
    }

    [HttpPost]                      // POST /api/v1/produtos
    public ActionResult<Produto> Criar([FromBody] Produto novo)
    {
        novo.Id = _banco.Count + 1;
        _banco.Add(novo);
        // Retorna 201 com header Location apontando para o novo recurso
        return CreatedAtAction(nameof(Obter), new { id = novo.Id }, novo);
    }
}

public class Produto
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public decimal Preco { get; set; }
}`})}),e.jsxs("p",{children:["Cada método público (",e.jsx("em",{children:"action method"}),") vira um endpoint. O atributo ",e.jsx("code",{children:"[HttpGet]"}),' diz "este método responde GET"; o sufixo ',e.jsx("code",{children:'("{id:int}")'})," adiciona um segmento de rota com constraint de tipo inteiro."]}),e.jsxs("h2",{children:["O atributo mágico ",e.jsx("code",{children:"[ApiController]"})]}),e.jsx("p",{children:"Esse atributo ativa quatro comportamentos automáticos que tornam APIs REST mais corretas e menos verbosas:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Validação automática:"})," se o ",e.jsx("code",{children:"ModelState"})," (a lista de erros de validação) tiver erros, o framework devolve 400 antes mesmo de entrar no método."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Inferência de origem:"})," tipos complexos vêm do corpo, primitivos da rota/query — você não precisa de ",e.jsx("code",{children:"[FromBody]"})," em quase nada."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Respostas 400 padronizadas:"})," em formato ",e.jsx("em",{children:"ProblemDetails"})," (RFC 7807), com lista de campos inválidos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multipart/form-data automático"})," quando há ",e.jsx("code",{children:"IFormFile"})," nos parâmetros."]})]}),e.jsx("h2",{children:"ActionResult<T>: tipo + status code"}),e.jsxs("p",{children:["O retorno ",e.jsx("code",{children:"ActionResult<Produto>"})," é um união: ou você retorna um ",e.jsx("code",{children:"Produto"})," (vira 200), ou um helper como ",e.jsx("code",{children:"NotFound()"}),", ",e.jsx("code",{children:"BadRequest()"}),", ",e.jsx("code",{children:"Ok(obj)"}),". Isso dá tipagem para Swagger e para clientes consumirem, sem perder a flexibilidade de devolver qualquer status HTTP."]}),e.jsx("pre",{children:e.jsx("code",{children:`[HttpGet("{id:int}")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public ActionResult<Produto> Obter(int id)
{
    var p = _banco.FirstOrDefault(x => x.Id == id);
    return p is null ? NotFound() : p; // conversão implícita para Ok(p)
}`})}),e.jsx("h2",{children:"Validação com Data Annotations"}),e.jsxs("p",{children:["Atributos como ",e.jsx("code",{children:"[Required]"}),", ",e.jsx("code",{children:"[StringLength]"})," e ",e.jsx("code",{children:"[Range]"})," ficam nas propriedades do Model. O ",e.jsx("code",{children:"[ApiController]"})," verifica antes do método executar:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.ComponentModel.DataAnnotations;

public class CriarProdutoDto
{
    [Required, StringLength(80, MinimumLength = 2)]
    public string Nome { get; set; } = "";

    [Range(0.01, 1_000_000)]
    public decimal Preco { get; set; }

    [EmailAddress]
    public string? EmailContato { get; set; }
}

[HttpPost]
public ActionResult<Produto> Criar(CriarProdutoDto dto)
{
    // Se chegar até aqui, dto já foi validado
    var p = new Produto { Nome = dto.Nome, Preco = dto.Preco };
    _banco.Add(p);
    return Created($"/api/v1/produtos/{p.Id}", p);
}`})}),e.jsxs("p",{children:["Veremos validação em profundidade no capítulo dedicado, incluindo a biblioteca ",e.jsx("strong",{children:"FluentValidation"})," para regras complexas."]}),e.jsxs(o,{type:"info",title:"Convenção é melhor que configuração",children:["O nome do Controller (",e.jsx("code",{children:"ProdutosController"}),") gera automaticamente a rota ",e.jsx("code",{children:"/produtos"})," via ",e.jsx("code",{children:'[Route("api/v1/[controller]")]'}),". Renomeie a classe e a URL muda junto — isso evita inconsistências."]}),e.jsx("h2",{children:"Injeção de dependências por construtor"}),e.jsx("p",{children:"Controllers recebem serviços via construtor. O ASP.NET cria uma nova instância a cada requisição e injeta o que você pediu:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class ProdutosController : ControllerBase
{
    private readonly IProdutoRepository _repo;
    private readonly ILogger<ProdutosController> _log;

    public ProdutosController(IProdutoRepository repo,
                              ILogger<ProdutosController> log)
    {
        _repo = repo;
        _log = log;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> Listar()
    {
        _log.LogInformation("Listando produtos");
        return Ok(await _repo.ListarTodosAsync());
    }
}`})}),e.jsxs(o,{type:"warning",title:"Não confunda Controller com Controller",children:[e.jsx("code",{children:"ControllerBase"})," serve para APIs JSON; ",e.jsx("code",{children:"Controller"})," (que herda de ",e.jsx("code",{children:"ControllerBase"}),") adiciona suporte a ",e.jsx("em",{children:"Views"})," Razor. Em uma API pura, herdar de ",e.jsx("code",{children:"Controller"})," só carrega coisas que você não vai usar."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"[ApiController]"}),":"]})," validação automática some, e tipos complexos sem ",e.jsx("code",{children:"[FromBody]"})," param de funcionar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não chamar ",e.jsx("code",{children:"AddControllers()"})]})," ou ",e.jsx("code",{children:"MapControllers()"}),': a API "compila" mas devolve 404 em tudo.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Conflito de rotas duplicadas:"})," dois métodos com a mesma ",e.jsx("code",{children:'[HttpGet("...")]'})," geram exceção em runtime."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Retornar ",e.jsx("code",{children:"Task"})," sem ",e.jsx("code",{children:"async"})]})," e esquecer o ",e.jsx("code",{children:"await"}),": a resposta sai antes de a operação terminar."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Controllers organizam endpoints em classes — ótimos para projetos médios e grandes."}),e.jsxs("li",{children:[e.jsx("code",{children:"AddControllers()"})," + ",e.jsx("code",{children:"MapControllers()"})," habilitam o estilo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[ApiController]"})," traz validação automática, inferência de origem e respostas 400 padronizadas."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ActionResult<T>"})," mistura tipo de dado com flexibilidade de status code."]}),e.jsx("li",{children:"Dependências chegam via construtor com injeção automática."}),e.jsxs("li",{children:["Convenção ",e.jsx("code",{children:'[Route("api/v1/[controller]")]'})," mantém rotas alinhadas ao nome da classe."]})]})]})}export{a as default};
