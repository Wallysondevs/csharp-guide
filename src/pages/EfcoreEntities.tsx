import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreEntities() {
  return (
    <PageContainer
      title="Modelando entidades para EF Core"
      subtitle="Como transformar suas classes C# em tabelas bem estruturadas no banco de dados."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Em EF Core, uma <strong>entidade</strong> é uma classe C# comum (POCO — <em>Plain Old CLR Object</em>, "objeto CLR simples") que representa uma linha de uma tabela. Cada propriedade pública vira, por padrão, uma coluna. Pense numa entidade como uma "ficha de cadastro": cada campo do formulário corresponde a um espaço na ficha. Modelar bem suas entidades é o que separa um esquema de banco limpo de um pântano cheio de colunas <code>nvarchar(max)</code> sem índices.
      </p>
      <p>
        EF Core usa três fontes de informação para mapear: <strong>convenções</strong> (regras automáticas), <strong>data annotations</strong> (atributos no código) e <strong>Fluent API</strong> (configuração no <code>OnModelCreating</code>). Conhecer as três é essencial para escolher a mais adequada a cada caso.
      </p>

      <h2>Convenções: o que EF Core já adivinha</h2>
      <p>
        Por padrão, EF Core descobre sozinho:
      </p>
      <ul>
        <li>Propriedade chamada <code>Id</code> ou <code>{`{NomeDaClasse}Id`}</code> vira <strong>chave primária</strong>.</li>
        <li>Tipo <code>int</code> ou <code>long</code> em chave primária ativa <em>auto-increment</em> (identidade no SQL Server, sequence no Postgres).</li>
        <li>Tipo <code>string</code> vira <code>nvarchar(max)</code> — texto sem limite, perigoso para performance.</li>
        <li>Propriedades <code>nullable</code> (terminadas em <code>?</code>) viram colunas nulas; as não-nullable, NOT NULL.</li>
      </ul>
      <pre><code>{`// EF Core deduz quase tudo aqui sem nenhuma anotação
public class Produto
{
    public int Id { get; set; }                      // chave primária, auto-increment
    public string Nome { get; set; } = "";           // NOT NULL nvarchar(max)
    public decimal Preco { get; set; }                // decimal(18,2) por convenção
    public DateTime CriadoEm { get; set; }            // datetime2 NOT NULL
    public string? Descricao { get; set; }            // nullable, pois é string?
}`}</code></pre>

      <AlertBox type="warning" title="nvarchar(max) é uma armadilha">
        Deixar string sem limite gera colunas que não cabem em índices e desperdiça memória. <strong>Sempre</strong> defina um tamanho máximo via <code>[MaxLength]</code> ou Fluent API.
      </AlertBox>

      <h2>Data Annotations: configuração com atributos</h2>
      <p>
        <strong>Atributos</strong> em C# são "etiquetas" presas a propriedades ou classes, escritos entre colchetes. EF Core lê várias delas para ajustar o mapeamento. Vivem no namespace <code>System.ComponentModel.DataAnnotations</code> (e <code>.Schema</code>).
      </p>
      <pre><code>{`using System.ComponentModel.DataAnnotations;
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
}`}</code></pre>

      <h2>Fluent API: configuração centralizada e poderosa</h2>
      <p>
        Quando a anotação não cobre o caso (índice composto, conversão de tipo, sequence customizada) — ou quando você prefere manter as classes "limpas", sem dependência de EF Core — use a Fluent API no <code>OnModelCreating</code>.
      </p>
      <pre><code>{`protected override void OnModelCreating(ModelBuilder mb)
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
}`}</code></pre>

      <h2>Separando configurações em arquivos próprios</h2>
      <p>
        Em projetos grandes, colocar todas as entidades no <code>OnModelCreating</code> vira uma confusão. A solução é implementar <code>IEntityTypeConfiguration&lt;T&gt;</code>, uma classe por entidade:
      </p>
      <pre><code>{`using Microsoft.EntityFrameworkCore;
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
}`}</code></pre>
      <p>
        Esse padrão escala bem: cada entidade tem seu arquivo, e novas configurações são detectadas automaticamente.
      </p>

      <h2>Owned types: agrupando valores sem virar tabela separada</h2>
      <p>
        Às vezes você tem um conjunto de campos que andam juntos — endereço, dimensões, dinheiro com moeda — mas que não merecem uma tabela própria. <strong>Owned types</strong> agrupam essas propriedades em uma classe C# enquanto, no banco, viram colunas da entidade dona.
      </p>
      <pre><code>{`public class Endereco
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
});`}</code></pre>

      <AlertBox type="info" title="Annotation vs Fluent: quando cada uma?">
        Use <strong>annotations</strong> em projetos pequenos e equipes pequenas — mais legível "no lugar". Use <strong>Fluent API</strong> quando o domínio precisa ser independente de EF Core (DDD), quando há configurações complexas, ou para manter regras em um só lugar.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>HasMaxLength</code> em strings:</strong> resulta em colunas <code>nvarchar(max)</code> que não podem ser indexadas.</li>
        <li><strong>Misturar annotations e Fluent para a mesma propriedade:</strong> Fluent ganha, mas confunde quem lê depois.</li>
        <li><strong>Marcar com <code>[Key]</code> sem necessidade:</strong> se a propriedade já se chama <code>Id</code>, a convenção cuida disso.</li>
        <li><strong>Não definir índices em colunas de busca frequente:</strong> queries viram lentas em produção.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Id</code> ou <code>{`{Classe}Id`}</code> vira chave primária por convenção.</li>
        <li>Annotations são rápidas; Fluent API é mais poderosa.</li>
        <li>Use <code>IEntityTypeConfiguration&lt;T&gt;</code> para escalar.</li>
        <li>Owned types agrupam propriedades sem criar tabela nova.</li>
        <li>Sempre limite tamanho de string e indexe colunas de busca.</li>
      </ul>
    </PageContainer>
  );
}
