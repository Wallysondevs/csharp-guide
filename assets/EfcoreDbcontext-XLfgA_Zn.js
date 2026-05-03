import{j as e}from"./index-CzLAthD5.js";import{P as n,A as o}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(n,{title:"DbContext: a porta de entrada do EF Core",subtitle:"Entenda a classe central que conecta o seu código C# ao banco de dados.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Se EF Core fosse uma loja, o ",e.jsx("strong",{children:"DbContext"}),' seria o balcão de atendimento: tudo passa por ele. Você fala "quero estes clientes", ele vai ao depósito (banco), traz o que pediu, anota o que você modificou e, quando você diz "salva", ele despacha as mudanças para o banco. Tecnicamente, ',e.jsx("code",{children:"DbContext"})," é uma classe que representa uma ",e.jsx("em",{children:"sessão"})," com o banco — ela mantém uma conexão, um cache de objetos rastreados (",e.jsx("em",{children:"change tracker"}),") e uma fila de operações pendentes."]}),e.jsxs("p",{children:["Toda aplicação que usa EF Core define ao menos uma classe que ",e.jsxs("strong",{children:["herda de ",e.jsx("code",{children:"DbContext"})]}),'. O verbo "herdar" significa que sua classe ganha automaticamente todos os métodos da classe-mãe (como ',e.jsx("code",{children:"SaveChanges"}),", ",e.jsx("code",{children:"Add"}),", ",e.jsx("code",{children:"Find"}),") e adiciona o que é específico do seu domínio."]}),e.jsx("h2",{children:"A estrutura básica"}),e.jsxs("p",{children:["Um DbContext típico declara ",e.jsx("strong",{children:e.jsx("code",{children:"DbSet<T>"})})," para cada entidade que você quer mapear. Pense no ",e.jsx("code",{children:"DbSet"}),' como uma "tabela virtual" em formato de coleção C#.']}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.EntityFrameworkCore;

public class LojaContext : DbContext
{
    // Cada DbSet vira uma tabela no banco
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<Produto> Produtos => Set<Produto>();

    // Construtor que aceita opções (forma moderna, usada com DI)
    public LojaContext(DbContextOptions<LojaContext> options) : base(options) { }
}`})}),e.jsxs("p",{children:["Note o uso de ",e.jsx("code",{children:"Set<T>()"})," em vez de ",e.jsx("code",{children:"{ get; set; }"}),": é a forma recomendada hoje, porque evita problemas com nullable references e funciona melhor com ",e.jsx("em",{children:"nullable reference types"})," ativado."]}),e.jsx("h2",{children:"OnConfiguring: definindo a connection string"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"connection string"}),' é o "endereço" do banco — diz qual servidor, qual base, quais credenciais. Há duas formas de fornecer:']}),e.jsx("pre",{children:e.jsx("code",{children:`// Forma 1: dentro do próprio DbContext (simples, mas hardcoded)
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
}`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Forma 2: via injeção de dependência (recomendado em apps reais)
// Em Program.cs (ASP.NET Core ou Worker Service):
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LojaContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Loja")));

// E no appsettings.json:
// {
//   "ConnectionStrings": {
//     "Loja": "Server=.;Database=Loja;Trusted_Connection=true;Encrypt=false"
//   }
// }`})}),e.jsxs(o,{type:"warning",title:"Nunca commit senha em código",children:["Connection strings com senha jamais devem ir para o Git. Use ",e.jsx("em",{children:"User Secrets"})," em desenvolvimento (",e.jsx("code",{children:"dotnet user-secrets set"}),") e variáveis de ambiente ou Azure Key Vault em produção."]}),e.jsx("h2",{children:"OnModelCreating: configurando o modelo via Fluent API"}),e.jsxs("p",{children:["EF Core descobre muita coisa por ",e.jsx("strong",{children:"convenção"})," (propriedade ",e.jsx("code",{children:"Id"})," = chave primária, por exemplo). Mas quando precisa fugir das convenções — nome de tabela diferente, índice composto, relacionamento exótico — você usa o ",e.jsx("code",{children:"OnModelCreating"})," com a ",e.jsx("em",{children:"Fluent API"})," (uma sequência de chamadas encadeadas)."]}),e.jsx("pre",{children:e.jsx("code",{children:`protected override void OnModelCreating(ModelBuilder modelBuilder)
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
}`})}),e.jsx("h2",{children:"Injeção de dependência: AddDbContext e tempo de vida"}),e.jsxs("p",{children:["Em ASP.NET Core, ",e.jsx("code",{children:"AddDbContext"})," registra o ",e.jsx("code",{children:"DbContext"})," com tempo de vida ",e.jsx("strong",{children:"scoped"}),". ",e.jsx("em",{children:"Scoped"}),' significa "uma instância por requisição HTTP": cada request HTTP recebe seu próprio ',e.jsx("code",{children:"DbContext"}),", isolado dos outros usuários, e ele é descartado ao fim da resposta."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Registro
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
}`})}),e.jsxs("p",{children:["Por que scoped e não singleton? Porque ",e.jsx("code",{children:"DbContext"})," ",e.jsx("strong",{children:"não é thread-safe"})," — duas requisições simultâneas usando o mesmo contexto causariam corrupção. Cada uma precisa do seu."]}),e.jsxs(o,{type:"info",title:"Pooling para performance",children:["Em apps de alto tráfego, use ",e.jsx("code",{children:"AddDbContextPool<LojaContext>(...)"})," em vez de ",e.jsx("code",{children:"AddDbContext"}),". Ele reaproveita instâncias de ",e.jsx("code",{children:"DbContext"})," entre requests, eliminando o custo de alocação. A semântica continua scoped do ponto de vista do código."]}),e.jsx("h2",{children:"O ciclo de vida em uma operação típica"}),e.jsx("p",{children:"Para visualizar tudo junto, este é o fluxo de uma requisição que adiciona um cliente:"}),e.jsx("pre",{children:e.jsx("code",{children:`// 1) ASP.NET Core cria um scope para a requisição
// 2) AddDbContext fornece um LojaContext novo
// 3) Seu código:
public async Task<int> CriarAsync(string nome, string email)
{
    var c = new Cliente { Nome = nome, Email = email };
    _db.Clientes.Add(c);              // marcado como Added no change tracker
    await _db.SaveChangesAsync();      // gera INSERT, executa, preenche c.Id
    return c.Id;
}
// 4) Retorno chega ao cliente, scope é fechado, DbContext é descartado`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Compartilhar DbContext entre threads:"}),' resulta em exceções aleatórias ("A second operation was started on this context"). Sempre uma instância por unidade de trabalho.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"using"})," em apps console:"]})," sem ",e.jsx("code",{children:"using var db = new LojaContext()"}),", o contexto não é descartado e a conexão fica aberta."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Registrar como Singleton:"})," erro grave em ASP.NET Core. Causa vazamento de memória e bugs de concorrência."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não chamar ",e.jsx("code",{children:"SaveChangesAsync"}),":"]})," as mudanças ficam só na memória; o banco nunca recebe nada."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"DbContext"})," é a sessão com o banco — uma instância por unidade de trabalho."]}),e.jsxs("li",{children:[e.jsx("code",{children:"DbSet<T>"})," representa cada tabela."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"AddDbContext"})," com tempo de vida scoped em ASP.NET Core."]}),e.jsxs("li",{children:[e.jsx("code",{children:"OnModelCreating"})," + Fluent API para configurações que fogem das convenções."]}),e.jsxs("li",{children:[e.jsx("code",{children:"AddDbContextPool"})," melhora performance em apps de alto tráfego."]})]})]})}export{r as default};
