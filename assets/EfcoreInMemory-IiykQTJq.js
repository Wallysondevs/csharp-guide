import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"Provider InMemory para testes",subtitle:"Como rodar testes do Entity Framework Core sem subir um banco de verdade — e os perigos sutis dessa abordagem.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Quando você escreve testes automatizados, quer que eles sejam ",e.jsx("strong",{children:"rápidos"})," e ",e.jsx("strong",{children:"isolados"})," — nada de depender de um servidor PostgreSQL local que pode estar fora do ar. Para isso, o Entity Framework Core (o ",e.jsx("strong",{children:"ORM"})," oficial do .NET — uma biblioteca que mapeia objetos C# para tabelas de banco) oferece o pacote ",e.jsx("code",{children:"Microsoft.EntityFrameworkCore.InMemory"}),", que finge ser um banco de dados, mas guarda tudo em estruturas na RAM. Útil — porém com armadilhas que vamos esmiuçar."]}),e.jsx("h2",{children:"Instalando e configurando"}),e.jsx("p",{children:"Em um projeto de testes (xUnit, por exemplo), adicione o pacote:"}),e.jsx("pre",{children:e.jsx("code",{children:`# No terminal, dentro do projeto de testes
dotnet add package Microsoft.EntityFrameworkCore.InMemory`})}),e.jsxs("p",{children:["Em seguida, troque o provider real pelo InMemory ao construir o ",e.jsx("code",{children:"DbContext"}),". ",e.jsx("code",{children:"DbContext"}),' é a classe que representa "a sessão com o banco" — ela conhece suas tabelas e suas operações.']}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.EntityFrameworkCore;

// Modelo
public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public decimal Preco { get; set; }
}

// Contexto
public class LojaContext : DbContext
{
    public DbSet<Produto> Produtos => Set<Produto>();

    public LojaContext(DbContextOptions<LojaContext> opt) : base(opt) { }
}`})}),e.jsx("h2",{children:"Escrevendo um teste com xUnit"}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.EntityFrameworkCore;
using Xunit;

public class ProdutoTests
{
    private LojaContext CriarContexto()
    {
        var opcoes = new DbContextOptionsBuilder<LojaContext>()
            // Cada teste recebe um banco isolado pelo nome único
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new LojaContext(opcoes);
    }

    [Fact]
    public async Task Adicionar_produto_persiste_no_contexto()
    {
        using var ctx = CriarContexto();

        ctx.Produtos.Add(new Produto { Nome = "Caneta", Preco = 2.5m });
        await ctx.SaveChangesAsync();

        var total = await ctx.Produtos.CountAsync();
        Assert.Equal(1, total);
    }
}`})}),e.jsxs("p",{children:["Repare no ",e.jsx("code",{children:"Guid.NewGuid().ToString()"})," como ",e.jsx("em",{children:"nome do banco"}),": o provider InMemory guarda dados num ",e.jsx("strong",{children:"dicionário estático compartilhado por nome"}),". Se dois testes usarem o mesmo nome, eles enxergam os dados um do outro — receita para falhas intermitentes."]}),e.jsx(o,{type:"warning",title:"Cada teste, um nome novo",children:"Sempre gere um nome único por teste (ou por instância). Se você reutilizar o mesmo nome ao longo da suíte, dados vazam entre testes e a ordem de execução passa a importar — exatamente o que testes automatizados deveriam evitar."}),e.jsx("h2",{children:"Limitações sérias do provider InMemory"}),e.jsxs("p",{children:["O time do EF Core ",e.jsx("strong",{children:"desencoraja oficialmente"})," o uso do InMemory para testar lógica de banco. Por quê? Porque ele ",e.jsx("em",{children:"não é um banco de verdade"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Não executa SQL"}),": traduções complexas (LINQ → SQL) que falhariam contra o banco real passam silenciosamente — ou vice-versa, expressões que funcionam em SQL não funcionam aqui."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"JOINs não respeitam regras relacionais"}),": ele apenas filtra coleções em memória; integridade referencial e cascatas se comportam diferente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Transações são "fake"'}),": ",e.jsx("code",{children:"BeginTransaction"})," existe, mas não dá rollback de verdade — qualquer mudança feita já está aplicada."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem constraints únicas reais"}),": índices únicos podem ser ignorados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem tipos específicos do banco"}),": ",e.jsx("code",{children:"NEWSEQUENTIALID()"}),", ",e.jsx("code",{children:"JSONB"}),", ",e.jsx("code",{children:"RAISERROR"}),"... nada disso."]})]}),e.jsx("h2",{children:"A alternativa recomendada: SQLite em memória"}),e.jsx("p",{children:"SQLite é um banco SQL completo de verdade que pode rodar inteiramente em RAM. Ele é leve, rápido e respeita constraints, transações e a maior parte do SQL padrão. É a opção preferida da Microsoft para testes do EF Core."}),e.jsx("pre",{children:e.jsx("code",{children:`# Instale o provider e o pacote do SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.Data.Sqlite`})}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

public class LojaTestesSqlite : IDisposable
{
    private readonly SqliteConnection _conexao;
    private readonly DbContextOptions<LojaContext> _opcoes;

    public LojaTestesSqlite()
    {
        // ":memory:" mantém o banco vivo enquanto a conexão estiver aberta
        _conexao = new SqliteConnection("DataSource=:memory:");
        _conexao.Open();

        _opcoes = new DbContextOptionsBuilder<LojaContext>()
            .UseSqlite(_conexao)
            .Options;

        using var ctx = new LojaContext(_opcoes);
        ctx.Database.EnsureCreated();   // cria tabelas a partir do modelo
    }

    [Fact]
    public async Task Constraint_unica_dispara_excecao()
    {
        using var ctx = new LojaContext(_opcoes);
        ctx.Produtos.Add(new Produto { Id = 1, Nome = "Caneta", Preco = 2 });
        ctx.Produtos.Add(new Produto { Id = 1, Nome = "Lápis",  Preco = 1 });

        await Assert.ThrowsAsync<DbUpdateException>(
            () => ctx.SaveChangesAsync());
    }

    public void Dispose() => _conexao.Dispose();
}`})}),e.jsxs(o,{type:"info",title:"Por que abrir e segurar a conexão?",children:["O banco ",e.jsx("code",{children:":memory:"}),' do SQLite vive enquanto pelo menos uma conexão estiver aberta. Se você fechasse, os dados sumiriam — então o padrão é abrir uma conexão "mestre" no construtor do teste e mantê-la viva até ',e.jsx("code",{children:"Dispose"}),"."]}),e.jsx("h2",{children:"Quando usar InMemory mesmo assim"}),e.jsxs("p",{children:["InMemory ainda tem espaço para testes ",e.jsx("em",{children:"de unidade puramente lógicos"}),", onde o EF Core é só um detalhe acessório e não há queries complexas. Exemplo: testar que um serviço chama ",e.jsx("code",{children:"SaveChangesAsync"})," uma vez. Para qualquer coisa envolvendo LINQ não trivial, JOINs ou transações, vá direto para SQLite ou para um banco real em container (Testcontainers)."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Reutilizar o mesmo ",e.jsx("code",{children:"databaseName"})]})," entre testes — vazamento de dados, falhas intermitentes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acreditar que constraints únicas são checadas"})," — InMemory não checa; o teste passa, mas em produção quebra."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Database.BeginTransaction"})]})," esperando rollback real — InMemory ignora."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"EnsureCreated()"})]})," com SQLite — sem tabelas, todo insert falha."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não chamar ",e.jsx("code",{children:"Open()"})," na conexão SQLite ",e.jsx("code",{children:":memory:"})]})," — banco efêmero some entre comandos."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Pacote: ",e.jsx("code",{children:"Microsoft.EntityFrameworkCore.InMemory"})," + ",e.jsx("code",{children:'UseInMemoryDatabase("nome")'}),"."]}),e.jsx("li",{children:"Use nomes únicos por teste para evitar contaminação cruzada."}),e.jsxs("li",{children:["InMemory ",e.jsx("strong",{children:"não é"})," um banco real: sem JOINs corretos, sem constraints, sem transações."]}),e.jsxs("li",{children:["Para testes que envolvem queries reais, prefira ",e.jsxs("strong",{children:["SQLite ",e.jsx("code",{children:":memory:"})]}),"."]}),e.jsxs("li",{children:["Para validação de produção, considere ",e.jsx("strong",{children:"Testcontainers"})," com o banco verdadeiro."]})]})]})}export{n as default};
