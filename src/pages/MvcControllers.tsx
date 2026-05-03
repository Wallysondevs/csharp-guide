import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MvcControllers() {
  return (
    <PageContainer
      title="MVC Controllers: estrutura clássica para APIs grandes"
      subtitle="Aprenda o estilo organizado em classes do ASP.NET Core, ideal para APIs que vão crescer com dezenas de endpoints e regras."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Se as Minimal APIs são como um caderninho de anotações onde você joga tudo na ordem que pensa, os <strong>Controllers</strong> são a pasta-arquivo bem organizada do escritório: cada Controller é uma classe que agrupa endpoints relacionados (todos os de "Produtos", todos os de "Usuários" etc.). Para projetos grandes, essa organização vale ouro — facilita encontrar, testar e revisar código.
      </p>

      <h2>O que significa "MVC"</h2>
      <p>
        <strong>MVC</strong> é a sigla de <em>Model-View-Controller</em>, um padrão de arquitetura criado nos anos 1970. A ideia: separar os <strong>dados</strong> (Model), a <strong>apresentação</strong> (View) e o <strong>fluxo de decisões</strong> (Controller). Em uma API JSON pura, a "View" praticamente desaparece — o que sobra são Models (classes/records que descrevem dados) e Controllers (classes que recebem requisições e devolvem respostas).
      </p>

      <h2>Habilitando Controllers no projeto</h2>
      <p>
        Em <code>Program.cs</code> você precisa registrar o serviço e mapear os endpoints:
      </p>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);

// 1. Registra a infraestrutura de Controllers
builder.Services.AddControllers();

var app = builder.Build();

// 2. Liga o roteamento por atributos para Controllers
app.MapControllers();

app.Run();`}</code></pre>
      <p>
        Sem o <code>AddControllers()</code> o framework não sabe que você quer usar esse estilo; sem o <code>MapControllers()</code> as rotas dos Controllers nunca são publicadas.
      </p>

      <h2>Anatomia de um Controller</h2>
      <p>
        Um Controller é uma classe pública que herda de <code>ControllerBase</code> (use <code>Controller</code> só se for renderizar HTML). Por convenção, fica em <code>Controllers/ProdutosController.cs</code>:
      </p>
      <pre><code>{`using Microsoft.AspNetCore.Mvc;

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
}`}</code></pre>
      <p>
        Cada método público (<em>action method</em>) vira um endpoint. O atributo <code>[HttpGet]</code> diz "este método responde GET"; o sufixo <code>("&#123;id:int&#125;")</code> adiciona um segmento de rota com constraint de tipo inteiro.
      </p>

      <h2>O atributo mágico <code>[ApiController]</code></h2>
      <p>
        Esse atributo ativa quatro comportamentos automáticos que tornam APIs REST mais corretas e menos verbosas:
      </p>
      <ul>
        <li><strong>Validação automática:</strong> se o <code>ModelState</code> (a lista de erros de validação) tiver erros, o framework devolve 400 antes mesmo de entrar no método.</li>
        <li><strong>Inferência de origem:</strong> tipos complexos vêm do corpo, primitivos da rota/query — você não precisa de <code>[FromBody]</code> em quase nada.</li>
        <li><strong>Respostas 400 padronizadas:</strong> em formato <em>ProblemDetails</em> (RFC 7807), com lista de campos inválidos.</li>
        <li><strong>Multipart/form-data automático</strong> quando há <code>IFormFile</code> nos parâmetros.</li>
      </ul>

      <h2>ActionResult&lt;T&gt;: tipo + status code</h2>
      <p>
        O retorno <code>ActionResult&lt;Produto&gt;</code> é um união: ou você retorna um <code>Produto</code> (vira 200), ou um helper como <code>NotFound()</code>, <code>BadRequest()</code>, <code>Ok(obj)</code>. Isso dá tipagem para Swagger e para clientes consumirem, sem perder a flexibilidade de devolver qualquer status HTTP.
      </p>
      <pre><code>{`[HttpGet("{id:int}")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public ActionResult<Produto> Obter(int id)
{
    var p = _banco.FirstOrDefault(x => x.Id == id);
    return p is null ? NotFound() : p; // conversão implícita para Ok(p)
}`}</code></pre>

      <h2>Validação com Data Annotations</h2>
      <p>
        Atributos como <code>[Required]</code>, <code>[StringLength]</code> e <code>[Range]</code> ficam nas propriedades do Model. O <code>[ApiController]</code> verifica antes do método executar:
      </p>
      <pre><code>{`using System.ComponentModel.DataAnnotations;

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
}`}</code></pre>
      <p>
        Veremos validação em profundidade no capítulo dedicado, incluindo a biblioteca <strong>FluentValidation</strong> para regras complexas.
      </p>

      <AlertBox type="info" title="Convenção é melhor que configuração">
        O nome do Controller (<code>ProdutosController</code>) gera automaticamente a rota <code>/produtos</code> via <code>[Route("api/v1/[controller]")]</code>. Renomeie a classe e a URL muda junto — isso evita inconsistências.
      </AlertBox>

      <h2>Injeção de dependências por construtor</h2>
      <p>
        Controllers recebem serviços via construtor. O ASP.NET cria uma nova instância a cada requisição e injeta o que você pediu:
      </p>
      <pre><code>{`public class ProdutosController : ControllerBase
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
}`}</code></pre>

      <AlertBox type="warning" title="Não confunda Controller com Controller">
        <code>ControllerBase</code> serve para APIs JSON; <code>Controller</code> (que herda de <code>ControllerBase</code>) adiciona suporte a <em>Views</em> Razor. Em uma API pura, herdar de <code>Controller</code> só carrega coisas que você não vai usar.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>[ApiController]</code>:</strong> validação automática some, e tipos complexos sem <code>[FromBody]</code> param de funcionar.</li>
        <li><strong>Não chamar <code>AddControllers()</code></strong> ou <code>MapControllers()</code>: a API "compila" mas devolve 404 em tudo.</li>
        <li><strong>Conflito de rotas duplicadas:</strong> dois métodos com a mesma <code>[HttpGet("...")]</code> geram exceção em runtime.</li>
        <li><strong>Retornar <code>Task</code> sem <code>async</code></strong> e esquecer o <code>await</code>: a resposta sai antes de a operação terminar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Controllers organizam endpoints em classes — ótimos para projetos médios e grandes.</li>
        <li><code>AddControllers()</code> + <code>MapControllers()</code> habilitam o estilo.</li>
        <li><code>[ApiController]</code> traz validação automática, inferência de origem e respostas 400 padronizadas.</li>
        <li><code>ActionResult&lt;T&gt;</code> mistura tipo de dado com flexibilidade de status code.</li>
        <li>Dependências chegam via construtor com injeção automática.</li>
        <li>Convenção <code>[Route("api/v1/[controller]")]</code> mantém rotas alinhadas ao nome da classe.</li>
      </ul>
    </PageContainer>
  );
}
