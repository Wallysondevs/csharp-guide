import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function XunitMoq() {
  return (
    <PageContainer
      title="Testes unitários com xUnit, Moq e FluentAssertions"
      subtitle="Aprenda a escrever testes legíveis, isolados e rápidos — a base do desenvolvimento profissional em .NET."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        Um <strong>teste unitário</strong> é um pequeno programa que exercita <em>uma única unidade de código</em> (geralmente um método) e verifica se ela se comporta como esperado. Pense num inspetor de qualidade na linha de produção: ele pega uma peça, mede, e diz "passou" ou "rejeitada" — automaticamente, mil vezes por dia. No mundo .NET, o trio mais popular para isso é <code>xUnit</code> (executor), <code>Moq</code> (substituto de dependências) e <code>FluentAssertions</code> (verificações expressivas). Vamos cobrir cada um e juntá-los no fim.
      </p>

      <h2>Criando o projeto de testes</h2>
      <pre><code>{`# Cria um projeto novo de testes xUnit
dotnet new xunit -o MinhaApp.Tests
cd MinhaApp.Tests

# Adiciona referência ao projeto que será testado
dotnet add reference ../MinhaApp/MinhaApp.csproj

# Pacotes auxiliares
dotnet add package Moq
dotnet add package FluentAssertions

# Roda os testes
dotnet test`}</code></pre>

      <h2>xUnit: <code>[Fact]</code> e <code>[Theory]</code></h2>
      <p>
        <code>[Fact]</code> marca um teste sem parâmetros — uma afirmação fixa. <code>[Theory]</code> + <code>[InlineData]</code> roda o mesmo teste com várias entradas, gerando um caso por linha.
      </p>
      <pre><code>{`using Xunit;

public class CalculadoraTests
{
    [Fact]
    public void Somar_dois_e_dois_deve_retornar_quatro()
    {
        var calc = new Calculadora();
        int resultado = calc.Somar(2, 2);
        Assert.Equal(4, resultado);
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(5, 7, 12)]
    [InlineData(-3, 3, 0)]
    public void Somar_varios_casos(int a, int b, int esperado)
    {
        var calc = new Calculadora();
        Assert.Equal(esperado, calc.Somar(a, b));
    }
}`}</code></pre>

      <AlertBox type="info" title="Por que xUnit cria uma instância por teste">
        Diferente do MSTest e NUnit, o xUnit cria <strong>uma instância nova</strong> da classe de teste a cada método executado. Isso garante isolamento total: estado deixado por um teste nunca contamina o próximo. O construtor faz papel do "setup".
      </AlertBox>

      <h2>Setup com construtor e <code>IDisposable</code></h2>
      <pre><code>{`public class PedidoTests : IDisposable
{
    private readonly Pedido _pedido;
    private readonly StringWriter _log;

    public PedidoTests()                 // roda ANTES de cada teste
    {
        _pedido = new Pedido();
        _log = new StringWriter();
        Console.SetOut(_log);
    }

    public void Dispose()                // roda DEPOIS de cada teste
    {
        _log.Dispose();
    }

    [Fact]
    public void Adicionar_item_aumenta_total() { /* ... */ }
}`}</code></pre>

      <h2>Compartilhando contexto pesado: <code>IClassFixture</code></h2>
      <p>
        Quando criar o objeto é caro (banco, arquivo, container), use uma <em>fixture</em>: criada uma única vez para todos os testes da classe e descartada ao final. A classe de teste recebe a instância pelo construtor.
      </p>
      <pre><code>{`public class BancoFixture : IDisposable
{
    public AppDbContext Db { get; }

    public BancoFixture()
    {
        Db = NovoContexto();        // setup pesado UMA vez
        Db.Database.EnsureCreated();
    }

    public void Dispose() => Db.Dispose();
}

public class UsuarioRepoTests : IClassFixture<BancoFixture>
{
    private readonly BancoFixture _fx;
    public UsuarioRepoTests(BancoFixture fx) => _fx = fx;

    [Fact]
    public void Inserir_funciona() { /* usa _fx.Db */ }
}`}</code></pre>

      <h2>Moq: substituindo dependências externas</h2>
      <p>
        A unidade que você está testando geralmente depende de outras coisas (banco, HTTP, e-mail). Em testes unitários, você não quer chamar essas coisas de verdade — quer apenas verificar como sua classe <em>interage</em> com elas. <code>Moq</code> cria implementações falsas (<em>mocks</em>) de qualquer interface ou classe abstrata.
      </p>
      <pre><code>{`using Moq;

public interface INotificador
{
    Task EnviarAsync(string destino, string msg);
}

public class ServicoCadastro
{
    private readonly INotificador _n;
    public ServicoCadastro(INotificador n) => _n = n;

    public async Task CadastrarAsync(string email)
    {
        // ... grava no banco ...
        await _n.EnviarAsync(email, "Bem-vindo!");
    }
}

public class ServicoCadastroTests
{
    [Fact]
    public async Task Cadastrar_envia_email_de_boas_vindas()
    {
        // Arrange
        var mock = new Mock<INotificador>();
        mock.Setup(n => n.EnviarAsync(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
        var servico = new ServicoCadastro(mock.Object);

        // Act
        await servico.CadastrarAsync("ana@x.com");

        // Assert: verifica que o método foi chamado uma vez com argumentos certos
        mock.Verify(n => n.EnviarAsync("ana@x.com", "Bem-vindo!"),
                    Times.Once);
    }
}`}</code></pre>

      <p>
        Padrões úteis: <code>It.IsAny&lt;T&gt;()</code> aceita qualquer valor; <code>Returns(...)</code> dita o retorno; <code>Throws(...)</code> faz o mock lançar exceção; <code>Verify(..., Times.Never)</code> garante que algo <em>não</em> foi chamado.
      </p>

      <h2>FluentAssertions: asserções legíveis</h2>
      <p>
        <code>Assert.Equal(esperado, real)</code> funciona, mas mensagens de erro são genéricas. <code>FluentAssertions</code> oferece uma API encadeada que lê como inglês e gera mensagens detalhadas.
      </p>
      <pre><code>{`using FluentAssertions;

[Fact]
public void Demonstracao_de_fluent_assertions()
{
    int idade = 25;
    idade.Should().BeGreaterThan(18).And.BeLessThan(60);

    string nome = "Ana";
    nome.Should().StartWith("A").And.HaveLength(3);

    var lista = new[] { 1, 2, 3 };
    lista.Should().HaveCount(3).And.Contain(2).And.NotContain(99);

    Action acao = () => throw new InvalidOperationException("nope");
    acao.Should().Throw<InvalidOperationException>()
        .WithMessage("*nope*");

    var obj = new { Nome = "Ana", Idade = 30 };
    obj.Should().BeEquivalentTo(new { Nome = "Ana", Idade = 30 });
}`}</code></pre>

      <h2>Padrão AAA e ciclo TDD</h2>
      <p>
        Todo teste segue <strong>Arrange / Act / Assert</strong> (preparar, executar, verificar). O ciclo <strong>TDD</strong> (Test-Driven Development) inverte a ordem normal de trabalho:
      </p>
      <ol>
        <li><strong>Red</strong>: escreva um teste para um comportamento que ainda não existe — ele falha.</li>
        <li><strong>Green</strong>: escreva o código mínimo para o teste passar.</li>
        <li><strong>Refactor</strong>: melhore o código (e o teste) mantendo tudo verde.</li>
      </ol>
      <pre><code>{`// 1. RED — teste falha porque CarrinhoVazio nem existe
[Fact]
public void Carrinho_recem_criado_esta_vazio()
{
    var c = new Carrinho();
    c.EstaVazio.Should().BeTrue();
}

// 2. GREEN — implementação mínima
public class Carrinho
{
    public bool EstaVazio => true;     // mentira, mas o teste passa
}

// 3. Próximo teste força a evolução do código:
[Fact]
public void Adicionar_item_carrinho_nao_esta_mais_vazio()
{
    var c = new Carrinho();
    c.Adicionar("livro");
    c.EstaVazio.Should().BeFalse();
}
// Agora o "true fixo" já não basta — refatore para algo real.`}</code></pre>

      <AlertBox type="warning" title="Não teste o framework">
        Não escreva testes que apenas validem que <code>List&lt;int&gt;.Add</code> aumenta <code>Count</code>. Teste a <strong>sua</strong> lógica de negócio — regras, cálculos, decisões. Tudo o mais é ruído que vai te frear no refactor.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Testes acoplados a ordem</strong>: estado estático vazando entre testes. Use construtor para sempre começar do zero.</li>
        <li><strong>Mockar tudo</strong>: testes ficam acoplados a implementação. Mocke apenas dependências externas (I/O, terceiros).</li>
        <li><strong>Asserção fraca</strong>: <code>Assert.NotNull(x)</code> quando deveria ser <code>x.Should().BeEquivalentTo(...)</code>.</li>
        <li><strong>Esquecer <code>await</code></strong> em método <code>async</code>: o teste passa mesmo se o código quebrar — porque a exceção fica em uma <code>Task</code> não observada.</li>
        <li><strong>Tempo real (<code>DateTime.Now</code>) no SUT</strong>: testes intermitentes. Injete um <code>IClock</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>xUnit: <code>[Fact]</code> para casos únicos, <code>[Theory]</code>+<code>[InlineData]</code> para parametrizados.</li>
        <li>Setup no construtor; teardown via <code>IDisposable</code>; contexto compartilhado via <code>IClassFixture</code>.</li>
        <li>Moq cria substitutos de interfaces/abstratas; <code>Setup</code>, <code>Returns</code>, <code>Verify</code> são o tripé.</li>
        <li>FluentAssertions deixa asserções legíveis e mensagens de erro úteis.</li>
        <li>Padrão AAA: Arrange / Act / Assert. Ciclo TDD: Red / Green / Refactor.</li>
        <li>Mockar só dependências externas; testar comportamento, não implementação.</li>
      </ul>
    </PageContainer>
  );
}
