import{j as e}from"./index-CzLAthD5.js";import{P as n,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(n,{title:"Modelando entidades para EF Core",subtitle:"Como transformar suas classes C# em tabelas bem estruturadas no banco de dados.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Em EF Core, uma ",e.jsx("strong",{children:"entidade"})," é uma classe C# comum (POCO — ",e.jsx("em",{children:"Plain Old CLR Object"}),', "objeto CLR simples") que representa uma linha de uma tabela. Cada propriedade pública vira, por padrão, uma coluna. Pense numa entidade como uma "ficha de cadastro": cada campo do formulário corresponde a um espaço na ficha. Modelar bem suas entidades é o que separa um esquema de banco limpo de um pântano cheio de colunas ',e.jsx("code",{children:"nvarchar(max)"})," sem índices."]}),e.jsxs("p",{children:["EF Core usa três fontes de informação para mapear: ",e.jsx("strong",{children:"convenções"})," (regras automáticas), ",e.jsx("strong",{children:"data annotations"})," (atributos no código) e ",e.jsx("strong",{children:"Fluent API"})," (configuração no ",e.jsx("code",{children:"OnModelCreating"}),"). Conhecer as três é essencial para escolher a mais adequada a cada caso."]}),e.jsx("h2",{children:"Convenções: o que EF Core já adivinha"}),e.jsx("p",{children:"Por padrão, EF Core descobre sozinho:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Propriedade chamada ",e.jsx("code",{children:"Id"})," ou ",e.jsx("code",{children:"{NomeDaClasse}Id"})," vira ",e.jsx("strong",{children:"chave primária"}),"."]}),e.jsxs("li",{children:["Tipo ",e.jsx("code",{children:"int"})," ou ",e.jsx("code",{children:"long"})," em chave primária ativa ",e.jsx("em",{children:"auto-increment"})," (identidade no SQL Server, sequence no Postgres)."]}),e.jsxs("li",{children:["Tipo ",e.jsx("code",{children:"string"})," vira ",e.jsx("code",{children:"nvarchar(max)"})," — texto sem limite, perigoso para performance."]}),e.jsxs("li",{children:["Propriedades ",e.jsx("code",{children:"nullable"})," (terminadas em ",e.jsx("code",{children:"?"}),") viram colunas nulas; as não-nullable, NOT NULL."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// EF Core deduz quase tudo aqui sem nenhuma anotação
public class Produto
{
    public int Id { get; set; }                      // chave primária, auto-increment
    public string Nome { get; set; } = "";           // NOT NULL nvarchar(max)
    public decimal Preco { get; set; }                // decimal(18,2) por convenção
    public DateTime CriadoEm { get; set; }            // datetime2 NOT NULL
    public string? Descricao { get; set; }            // nullable, pois é string?
}`})}),e.jsxs(a,{type:"warning",title:"nvarchar(max) é uma armadilha",children:["Deixar string sem limite gera colunas que não cabem em índices e desperdiça memória. ",e.jsx("strong",{children:"Sempre"})," defina um tamanho máximo via ",e.jsx("code",{children:"[MaxLength]"})," ou Fluent API."]}),e.jsx("h2",{children:"Data Annotations: configuração com atributos"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Atributos"}),' em C# são "etiquetas" presas a propriedades ou classes, escritos entre colchetes. EF Core lê várias delas para ajustar o mapeamento. Vivem no namespace ',e.jsx("code",{children:"System.ComponentModel.DataAnnotations"})," (e ",e.jsx("code",{children:".Schema"}),")."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("tb_clientes")] // muda o nome da tabela
public class Cliente
{
    [Key]                              // explicitamente chave primária
    public int CodigoCliente { get; set; }

    [Required]                          // NOT NULL mesmo se a propriedade fosse string?
    [MaxLength(100)]                   // nvarchar(100)
    public string Nome { get; set; } = "";

    [EmailAddress]                      // só valida no app; não vira constraint SQL
    [MaxLength(200)]
    public string Email { get; set; } = "";

    [Column(TypeName = "decimal(10,2)")] // tipo SQL específico
    public decimal LimiteCredito { get; set; }

    [NotMapped]                         // ignora — não vira coluna
    public string NomeCompletoExibicao => Nome.ToUpper();

    [Timestamp]                         // coluna de concorrência otimista
    public byte[] RowVersion { get; set; } = [];
}`})}),e.jsx("h2",{children:"Fluent API: configuração centralizada e poderosa"}),e.jsxs("p",{children:['Quando a anotação não cobre o caso (índice composto, conversão de tipo, sequence customizada) — ou quando você prefere manter as classes "limpas", sem dependência de EF Core — use a Fluent API no ',e.jsx("code",{children:"OnModelCreating"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`protected override void OnModelCreating(ModelBuilder mb)
{
    mb.Entity<Cliente>(e =>
    {
        e.ToTable("tb_clientes");
        e.HasKey(c => c.CodigoCliente);
        e.Property(c => c.Nome).IsRequired().HasMaxLength(100);
        e.Property(c => c.Email).HasMaxLength(200);

        // Índice único com nome customizado
        e.HasIndex(c => c.Email).IsUnique().HasDatabaseName("ux_clientes_email");

        // Índice composto (filtros frequentes por cidade+ativo)
        e.HasIndex(c => new { c.Cidade, c.Ativo });

        // Valor padrão gerado pelo banco
        e.Property(c => c.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
    });
}`})}),e.jsx("h2",{children:"Separando configurações em arquivos próprios"}),e.jsxs("p",{children:["Em projetos grandes, colocar todas as entidades no ",e.jsx("code",{children:"OnModelCreating"})," vira uma confusão. A solução é implementar ",e.jsx("code",{children:"IEntityTypeConfiguration<T>"}),", uma classe por entidade:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ClienteConfig : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> e)
    {
        e.ToTable("tb_clientes");
        e.Property(c => c.Nome).HasMaxLength(100).IsRequired();
        e.HasIndex(c => c.Email).IsUnique();
    }
}

// No DbContext, basta:
protected override void OnModelCreating(ModelBuilder mb)
{
    mb.ApplyConfigurationsFromAssembly(typeof(LojaContext).Assembly);
}`})}),e.jsx("p",{children:"Esse padrão escala bem: cada entidade tem seu arquivo, e novas configurações são detectadas automaticamente."}),e.jsx("h2",{children:"Owned types: agrupando valores sem virar tabela separada"}),e.jsxs("p",{children:["Às vezes você tem um conjunto de campos que andam juntos — endereço, dimensões, dinheiro com moeda — mas que não merecem uma tabela própria. ",e.jsx("strong",{children:"Owned types"})," agrupam essas propriedades em uma classe C# enquanto, no banco, viram colunas da entidade dona."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Endereco
{
    public string Rua { get; set; } = "";
    public string Cidade { get; set; } = "";
    public string Cep { get; set; } = "";
}

public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public Endereco Endereco { get; set; } = new();        // owned
    public Endereco? EnderecoEntrega { get; set; }          // owned opcional
}

// Configuração
mb.Entity<Cliente>(e =>
{
    e.OwnsOne(c => c.Endereco, end =>
    {
        end.Property(p => p.Rua).HasColumnName("Rua").HasMaxLength(200);
        end.Property(p => p.Cidade).HasColumnName("Cidade").HasMaxLength(100);
        end.Property(p => p.Cep).HasColumnName("Cep").HasMaxLength(10);
    });
    e.OwnsOne(c => c.EnderecoEntrega); // colunas viram EnderecoEntrega_Rua, etc.
});`})}),e.jsxs(a,{type:"info",title:"Annotation vs Fluent: quando cada uma?",children:["Use ",e.jsx("strong",{children:"annotations"}),' em projetos pequenos e equipes pequenas — mais legível "no lugar". Use ',e.jsx("strong",{children:"Fluent API"})," quando o domínio precisa ser independente de EF Core (DDD), quando há configurações complexas, ou para manter regras em um só lugar."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"HasMaxLength"})," em strings:"]})," resulta em colunas ",e.jsx("code",{children:"nvarchar(max)"})," que não podem ser indexadas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar annotations e Fluent para a mesma propriedade:"})," Fluent ganha, mas confunde quem lê depois."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Marcar com ",e.jsx("code",{children:"[Key]"})," sem necessidade:"]})," se a propriedade já se chama ",e.jsx("code",{children:"Id"}),", a convenção cuida disso."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não definir índices em colunas de busca frequente:"})," queries viram lentas em produção."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Id"})," ou ",e.jsx("code",{children:"{Classe}Id"})," vira chave primária por convenção."]}),e.jsx("li",{children:"Annotations são rápidas; Fluent API é mais poderosa."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"IEntityTypeConfiguration<T>"})," para escalar."]}),e.jsx("li",{children:"Owned types agrupam propriedades sem criar tabela nova."}),e.jsx("li",{children:"Sempre limite tamanho de string e indexe colunas de busca."})]})]})}export{i as default};
