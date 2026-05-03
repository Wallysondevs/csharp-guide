import{j as e}from"./index-CzLAthD5.js";import{P as a,A as s}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"Testes unitários com xUnit, Moq e FluentAssertions",subtitle:"Aprenda a escrever testes legíveis, isolados e rápidos — a base do desenvolvimento profissional em .NET.",difficulty:"intermediario",timeToRead:"16 min",children:[e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"teste unitário"})," é um pequeno programa que exercita ",e.jsx("em",{children:"uma única unidade de código"}),' (geralmente um método) e verifica se ela se comporta como esperado. Pense num inspetor de qualidade na linha de produção: ele pega uma peça, mede, e diz "passou" ou "rejeitada" — automaticamente, mil vezes por dia. No mundo .NET, o trio mais popular para isso é ',e.jsx("code",{children:"xUnit"})," (executor), ",e.jsx("code",{children:"Moq"})," (substituto de dependências) e ",e.jsx("code",{children:"FluentAssertions"})," (verificações expressivas). Vamos cobrir cada um e juntá-los no fim."]}),e.jsx("h2",{children:"Criando o projeto de testes"}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria um projeto novo de testes xUnit
dotnet new xunit -o MinhaApp.Tests
cd MinhaApp.Tests

# Adiciona referência ao projeto que será testado
dotnet add reference ../MinhaApp/MinhaApp.csproj

# Pacotes auxiliares
dotnet add package Moq
dotnet add package FluentAssertions

# Roda os testes
dotnet test`})}),e.jsxs("h2",{children:["xUnit: ",e.jsx("code",{children:"[Fact]"})," e ",e.jsx("code",{children:"[Theory]"})]}),e.jsxs("p",{children:[e.jsx("code",{children:"[Fact]"})," marca um teste sem parâmetros — uma afirmação fixa. ",e.jsx("code",{children:"[Theory]"})," + ",e.jsx("code",{children:"[InlineData]"})," roda o mesmo teste com várias entradas, gerando um caso por linha."]}),e.jsx("pre",{children:e.jsx("code",{children:`using Xunit;

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
}`})}),e.jsxs(s,{type:"info",title:"Por que xUnit cria uma instância por teste",children:["Diferente do MSTest e NUnit, o xUnit cria ",e.jsx("strong",{children:"uma instância nova"}),' da classe de teste a cada método executado. Isso garante isolamento total: estado deixado por um teste nunca contamina o próximo. O construtor faz papel do "setup".']}),e.jsxs("h2",{children:["Setup com construtor e ",e.jsx("code",{children:"IDisposable"})]}),e.jsx("pre",{children:e.jsx("code",{children:`public class PedidoTests : IDisposable
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
}`})}),e.jsxs("h2",{children:["Compartilhando contexto pesado: ",e.jsx("code",{children:"IClassFixture"})]}),e.jsxs("p",{children:["Quando criar o objeto é caro (banco, arquivo, container), use uma ",e.jsx("em",{children:"fixture"}),": criada uma única vez para todos os testes da classe e descartada ao final. A classe de teste recebe a instância pelo construtor."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class BancoFixture : IDisposable
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
}`})}),e.jsx("h2",{children:"Moq: substituindo dependências externas"}),e.jsxs("p",{children:["A unidade que você está testando geralmente depende de outras coisas (banco, HTTP, e-mail). Em testes unitários, você não quer chamar essas coisas de verdade — quer apenas verificar como sua classe ",e.jsx("em",{children:"interage"})," com elas. ",e.jsx("code",{children:"Moq"})," cria implementações falsas (",e.jsx("em",{children:"mocks"}),") de qualquer interface ou classe abstrata."]}),e.jsx("pre",{children:e.jsx("code",{children:`using Moq;

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
}`})}),e.jsxs("p",{children:["Padrões úteis: ",e.jsx("code",{children:"It.IsAny<T>()"})," aceita qualquer valor; ",e.jsx("code",{children:"Returns(...)"})," dita o retorno; ",e.jsx("code",{children:"Throws(...)"})," faz o mock lançar exceção; ",e.jsx("code",{children:"Verify(..., Times.Never)"})," garante que algo ",e.jsx("em",{children:"não"})," foi chamado."]}),e.jsx("h2",{children:"FluentAssertions: asserções legíveis"}),e.jsxs("p",{children:[e.jsx("code",{children:"Assert.Equal(esperado, real)"})," funciona, mas mensagens de erro são genéricas. ",e.jsx("code",{children:"FluentAssertions"})," oferece uma API encadeada que lê como inglês e gera mensagens detalhadas."]}),e.jsx("pre",{children:e.jsx("code",{children:`using FluentAssertions;

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
}`})}),e.jsx("h2",{children:"Padrão AAA e ciclo TDD"}),e.jsxs("p",{children:["Todo teste segue ",e.jsx("strong",{children:"Arrange / Act / Assert"})," (preparar, executar, verificar). O ciclo ",e.jsx("strong",{children:"TDD"})," (Test-Driven Development) inverte a ordem normal de trabalho:"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Red"}),": escreva um teste para um comportamento que ainda não existe — ele falha."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Green"}),": escreva o código mínimo para o teste passar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Refactor"}),": melhore o código (e o teste) mantendo tudo verde."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1. RED — teste falha porque CarrinhoVazio nem existe
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
// Agora o "true fixo" já não basta — refatore para algo real.`})}),e.jsxs(s,{type:"warning",title:"Não teste o framework",children:["Não escreva testes que apenas validem que ",e.jsx("code",{children:"List<int>.Add"})," aumenta ",e.jsx("code",{children:"Count"}),". Teste a ",e.jsx("strong",{children:"sua"})," lógica de negócio — regras, cálculos, decisões. Tudo o mais é ruído que vai te frear no refactor."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Testes acoplados a ordem"}),": estado estático vazando entre testes. Use construtor para sempre começar do zero."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mockar tudo"}),": testes ficam acoplados a implementação. Mocke apenas dependências externas (I/O, terceiros)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Asserção fraca"}),": ",e.jsx("code",{children:"Assert.NotNull(x)"})," quando deveria ser ",e.jsx("code",{children:"x.Should().BeEquivalentTo(...)"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"await"})]})," em método ",e.jsx("code",{children:"async"}),": o teste passa mesmo se o código quebrar — porque a exceção fica em uma ",e.jsx("code",{children:"Task"})," não observada."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tempo real (",e.jsx("code",{children:"DateTime.Now"}),") no SUT"]}),": testes intermitentes. Injete um ",e.jsx("code",{children:"IClock"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["xUnit: ",e.jsx("code",{children:"[Fact]"})," para casos únicos, ",e.jsx("code",{children:"[Theory]"}),"+",e.jsx("code",{children:"[InlineData]"})," para parametrizados."]}),e.jsxs("li",{children:["Setup no construtor; teardown via ",e.jsx("code",{children:"IDisposable"}),"; contexto compartilhado via ",e.jsx("code",{children:"IClassFixture"}),"."]}),e.jsxs("li",{children:["Moq cria substitutos de interfaces/abstratas; ",e.jsx("code",{children:"Setup"}),", ",e.jsx("code",{children:"Returns"}),", ",e.jsx("code",{children:"Verify"})," são o tripé."]}),e.jsx("li",{children:"FluentAssertions deixa asserções legíveis e mensagens de erro úteis."}),e.jsx("li",{children:"Padrão AAA: Arrange / Act / Assert. Ciclo TDD: Red / Green / Refactor."}),e.jsx("li",{children:"Mockar só dependências externas; testar comportamento, não implementação."})]})]})}export{i as default};
