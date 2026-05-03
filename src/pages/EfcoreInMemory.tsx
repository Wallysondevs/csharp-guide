import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreInMemory() {
  return (
    <PageContainer
      title="Provider InMemory para testes"
      subtitle="Como rodar testes do Entity Framework Core sem subir um banco de verdade — e os perigos sutis dessa abordagem."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Quando você escreve testes automatizados, quer que eles sejam <strong>rápidos</strong> e <strong>isolados</strong> — nada de depender de um servidor PostgreSQL local que pode estar fora do ar. Para isso, o Entity Framework Core (o <strong>ORM</strong> oficial do .NET — uma biblioteca que mapeia objetos C# para tabelas de banco) oferece o pacote <code>Microsoft.EntityFrameworkCore.InMemory</code>, que finge ser um banco de dados, mas guarda tudo em estruturas na RAM. Útil — porém com armadilhas que vamos esmiuçar.
      </p>

      <h2>Instalando e configurando</h2>
      <p>
        Em um projeto de testes (xUnit, por exemplo), adicione o pacote:
      </p>
      <pre><code>{`# No terminal, dentro do projeto de testes
dotnet add package Microsoft.EntityFrameworkCore.InMemory`}</code></pre>
      <p>
        Em seguida, troque o provider real pelo InMemory ao construir o <code>DbContext</code>. <code>DbContext</code> é a classe que representa "a sessão com o banco" — ela conhece suas tabelas e suas operações.
      </p>
      <pre><code>{`using Microsoft.EntityFrameworkCore;

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
}`}</code></pre>

      <h2>Escrevendo um teste com xUnit</h2>
      <pre><code>{`using Microsoft.EntityFrameworkCore;
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
}`}</code></pre>
      <p>
        Repare no <code>Guid.NewGuid().ToString()</code> como <em>nome do banco</em>: o provider InMemory guarda dados num <strong>dicionário estático compartilhado por nome</strong>. Se dois testes usarem o mesmo nome, eles enxergam os dados um do outro — receita para falhas intermitentes.
      </p>

      <AlertBox type="warning" title="Cada teste, um nome novo">
        Sempre gere um nome único por teste (ou por instância). Se você reutilizar o mesmo nome ao longo da suíte, dados vazam entre testes e a ordem de execução passa a importar — exatamente o que testes automatizados deveriam evitar.
      </AlertBox>

      <h2>Limitações sérias do provider InMemory</h2>
      <p>
        O time do EF Core <strong>desencoraja oficialmente</strong> o uso do InMemory para testar lógica de banco. Por quê? Porque ele <em>não é um banco de verdade</em>:
      </p>
      <ul>
        <li><strong>Não executa SQL</strong>: traduções complexas (LINQ → SQL) que falhariam contra o banco real passam silenciosamente — ou vice-versa, expressões que funcionam em SQL não funcionam aqui.</li>
        <li><strong>JOINs não respeitam regras relacionais</strong>: ele apenas filtra coleções em memória; integridade referencial e cascatas se comportam diferente.</li>
        <li><strong>Transações são "fake"</strong>: <code>BeginTransaction</code> existe, mas não dá rollback de verdade — qualquer mudança feita já está aplicada.</li>
        <li><strong>Sem constraints únicas reais</strong>: índices únicos podem ser ignorados.</li>
        <li><strong>Sem tipos específicos do banco</strong>: <code>NEWSEQUENTIALID()</code>, <code>JSONB</code>, <code>RAISERROR</code>... nada disso.</li>
      </ul>

      <h2>A alternativa recomendada: SQLite em memória</h2>
      <p>
        SQLite é um banco SQL completo de verdade que pode rodar inteiramente em RAM. Ele é leve, rápido e respeita constraints, transações e a maior parte do SQL padrão. É a opção preferida da Microsoft para testes do EF Core.
      </p>
      <pre><code>{`# Instale o provider e o pacote do SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.Data.Sqlite`}</code></pre>
      <pre><code>{`using Microsoft.Data.Sqlite;
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
}`}</code></pre>

      <AlertBox type="info" title="Por que abrir e segurar a conexão?">
        O banco <code>:memory:</code> do SQLite vive enquanto pelo menos uma conexão estiver aberta. Se você fechasse, os dados sumiriam — então o padrão é abrir uma conexão "mestre" no construtor do teste e mantê-la viva até <code>Dispose</code>.
      </AlertBox>

      <h2>Quando usar InMemory mesmo assim</h2>
      <p>
        InMemory ainda tem espaço para testes <em>de unidade puramente lógicos</em>, onde o EF Core é só um detalhe acessório e não há queries complexas. Exemplo: testar que um serviço chama <code>SaveChangesAsync</code> uma vez. Para qualquer coisa envolvendo LINQ não trivial, JOINs ou transações, vá direto para SQLite ou para um banco real em container (Testcontainers).
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Reutilizar o mesmo <code>databaseName</code></strong> entre testes — vazamento de dados, falhas intermitentes.</li>
        <li><strong>Acreditar que constraints únicas são checadas</strong> — InMemory não checa; o teste passa, mas em produção quebra.</li>
        <li><strong>Usar <code>Database.BeginTransaction</code></strong> esperando rollback real — InMemory ignora.</li>
        <li><strong>Esquecer <code>EnsureCreated()</code></strong> com SQLite — sem tabelas, todo insert falha.</li>
        <li><strong>Não chamar <code>Open()</code> na conexão SQLite <code>:memory:</code></strong> — banco efêmero some entre comandos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Pacote: <code>Microsoft.EntityFrameworkCore.InMemory</code> + <code>UseInMemoryDatabase("nome")</code>.</li>
        <li>Use nomes únicos por teste para evitar contaminação cruzada.</li>
        <li>InMemory <strong>não é</strong> um banco real: sem JOINs corretos, sem constraints, sem transações.</li>
        <li>Para testes que envolvem queries reais, prefira <strong>SQLite <code>:memory:</code></strong>.</li>
        <li>Para validação de produção, considere <strong>Testcontainers</strong> com o banco verdadeiro.</li>
      </ul>
    </PageContainer>
  );
}
