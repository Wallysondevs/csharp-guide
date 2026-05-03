import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreDbcontext() {
  return (
    <PageContainer
      title="DbContext: a porta de entrada do EF Core"
      subtitle="Entenda a classe central que conecta o seu código C# ao banco de dados."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Se EF Core fosse uma loja, o <strong>DbContext</strong> seria o balcão de atendimento: tudo passa por ele. Você fala "quero estes clientes", ele vai ao depósito (banco), traz o que pediu, anota o que você modificou e, quando você diz "salva", ele despacha as mudanças para o banco. Tecnicamente, <code>DbContext</code> é uma classe que representa uma <em>sessão</em> com o banco — ela mantém uma conexão, um cache de objetos rastreados (<em>change tracker</em>) e uma fila de operações pendentes.
      </p>
      <p>
        Toda aplicação que usa EF Core define ao menos uma classe que <strong>herda de <code>DbContext</code></strong>. O verbo "herdar" significa que sua classe ganha automaticamente todos os métodos da classe-mãe (como <code>SaveChanges</code>, <code>Add</code>, <code>Find</code>) e adiciona o que é específico do seu domínio.
      </p>

      <h2>A estrutura básica</h2>
      <p>
        Um DbContext típico declara <strong><code>DbSet&lt;T&gt;</code></strong> para cada entidade que você quer mapear. Pense no <code>DbSet</code> como uma "tabela virtual" em formato de coleção C#.
      </p>
      <pre><code>{`using Microsoft.EntityFrameworkCore;

public class LojaContext : DbContext
{
    // Cada DbSet vira uma tabela no banco
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<Produto> Produtos => Set<Produto>();

    // Construtor que aceita opções (forma moderna, usada com DI)
    public LojaContext(DbContextOptions<LojaContext> options) : base(options) { }
}`}</code></pre>
      <p>
        Note o uso de <code>Set&lt;T&gt;()</code> em vez de <code>{`{ get; set; }`}</code>: é a forma recomendada hoje, porque evita problemas com nullable references e funciona melhor com <em>nullable reference types</em> ativado.
      </p>

      <h2>OnConfiguring: definindo a connection string</h2>
      <p>
        A <strong>connection string</strong> é o "endereço" do banco — diz qual servidor, qual base, quais credenciais. Há duas formas de fornecer:
      </p>
      <pre><code>{`// Forma 1: dentro do próprio DbContext (simples, mas hardcoded)
public class LojaContext : DbContext
{
    public DbSet<Cliente> Clientes => Set<Cliente>();

    protected override void OnConfiguring(DbContextOptionsBuilder opt)
    {
        // Só configura se ainda não foi configurado externamente
        if (!opt.IsConfigured)
        {
            opt.UseSqlServer("Server=.;Database=Loja;Trusted_Connection=true;Encrypt=false");
        }
    }
}`}</code></pre>
      <pre><code>{`// Forma 2: via injeção de dependência (recomendado em apps reais)
// Em Program.cs (ASP.NET Core ou Worker Service):
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LojaContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Loja")));

// E no appsettings.json:
// {
//   "ConnectionStrings": {
//     "Loja": "Server=.;Database=Loja;Trusted_Connection=true;Encrypt=false"
//   }
// }`}</code></pre>

      <AlertBox type="warning" title="Nunca commit senha em código">
        Connection strings com senha jamais devem ir para o Git. Use <em>User Secrets</em> em desenvolvimento (<code>dotnet user-secrets set</code>) e variáveis de ambiente ou Azure Key Vault em produção.
      </AlertBox>

      <h2>OnModelCreating: configurando o modelo via Fluent API</h2>
      <p>
        EF Core descobre muita coisa por <strong>convenção</strong> (propriedade <code>Id</code> = chave primária, por exemplo). Mas quando precisa fugir das convenções — nome de tabela diferente, índice composto, relacionamento exótico — você usa o <code>OnModelCreating</code> com a <em>Fluent API</em> (uma sequência de chamadas encadeadas).
      </p>
      <pre><code>{`protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Configurando a entidade Cliente
    modelBuilder.Entity<Cliente>(entidade =>
    {
        // Renomeando a tabela
        entidade.ToTable("tb_clientes");

        // Tornando Email obrigatório e único
        entidade.Property(c => c.Email).IsRequired().HasMaxLength(200);
        entidade.HasIndex(c => c.Email).IsUnique();

        // Definindo precisão de um decimal
        entidade.Property(c => c.LimiteCredito).HasPrecision(18, 2);
    });

    // Aplicando todas as IEntityTypeConfiguration do assembly de uma vez
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(LojaContext).Assembly);
}`}</code></pre>

      <h2>Injeção de dependência: AddDbContext e tempo de vida</h2>
      <p>
        Em ASP.NET Core, <code>AddDbContext</code> registra o <code>DbContext</code> com tempo de vida <strong>scoped</strong>. <em>Scoped</em> significa "uma instância por requisição HTTP": cada request HTTP recebe seu próprio <code>DbContext</code>, isolado dos outros usuários, e ele é descartado ao fim da resposta.
      </p>
      <pre><code>{`// Registro
builder.Services.AddDbContext<LojaContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Loja")));

// Injeção em um controller ou minimal API
app.MapGet("/clientes", async (LojaContext db) =>
    await db.Clientes.ToListAsync());

// Injeção em um serviço comum
public class ClienteServico
{
    private readonly LojaContext _db;
    public ClienteServico(LojaContext db) => _db = db;

    public Task<Cliente?> BuscarAsync(int id) => _db.Clientes.FindAsync(id).AsTask();
}`}</code></pre>
      <p>
        Por que scoped e não singleton? Porque <code>DbContext</code> <strong>não é thread-safe</strong> — duas requisições simultâneas usando o mesmo contexto causariam corrupção. Cada uma precisa do seu.
      </p>

      <AlertBox type="info" title="Pooling para performance">
        Em apps de alto tráfego, use <code>AddDbContextPool&lt;LojaContext&gt;(...)</code> em vez de <code>AddDbContext</code>. Ele reaproveita instâncias de <code>DbContext</code> entre requests, eliminando o custo de alocação. A semântica continua scoped do ponto de vista do código.
      </AlertBox>

      <h2>O ciclo de vida em uma operação típica</h2>
      <p>
        Para visualizar tudo junto, este é o fluxo de uma requisição que adiciona um cliente:
      </p>
      <pre><code>{`// 1) ASP.NET Core cria um scope para a requisição
// 2) AddDbContext fornece um LojaContext novo
// 3) Seu código:
public async Task<int> CriarAsync(string nome, string email)
{
    var c = new Cliente { Nome = nome, Email = email };
    _db.Clientes.Add(c);              // marcado como Added no change tracker
    await _db.SaveChangesAsync();      // gera INSERT, executa, preenche c.Id
    return c.Id;
}
// 4) Retorno chega ao cliente, scope é fechado, DbContext é descartado`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Compartilhar DbContext entre threads:</strong> resulta em exceções aleatórias ("A second operation was started on this context"). Sempre uma instância por unidade de trabalho.</li>
        <li><strong>Esquecer <code>using</code> em apps console:</strong> sem <code>using var db = new LojaContext()</code>, o contexto não é descartado e a conexão fica aberta.</li>
        <li><strong>Registrar como Singleton:</strong> erro grave em ASP.NET Core. Causa vazamento de memória e bugs de concorrência.</li>
        <li><strong>Não chamar <code>SaveChangesAsync</code>:</strong> as mudanças ficam só na memória; o banco nunca recebe nada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>DbContext</code> é a sessão com o banco — uma instância por unidade de trabalho.</li>
        <li><code>DbSet&lt;T&gt;</code> representa cada tabela.</li>
        <li>Use <code>AddDbContext</code> com tempo de vida scoped em ASP.NET Core.</li>
        <li><code>OnModelCreating</code> + Fluent API para configurações que fogem das convenções.</li>
        <li><code>AddDbContextPool</code> melhora performance em apps de alto tráfego.</li>
      </ul>
    </PageContainer>
  );
}
