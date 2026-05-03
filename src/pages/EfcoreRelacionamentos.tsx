import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreRelacionamentos() {
  return (
    <PageContainer
      title="Relacionamentos no EF Core: 1:1, 1:N e N:N"
      subtitle="Como modelar associações entre entidades — clientes têm pedidos, pedidos têm itens, alunos têm cursos."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        No mundo real, dados raramente vivem isolados. Um cliente tem pedidos, um pedido tem itens, um aluno está matriculado em vários cursos. No banco, essas conexões são feitas com <strong>chaves estrangeiras</strong> (foreign keys, FKs) — colunas que apontam para a chave primária de outra tabela. Em EF Core, você não precisa pensar em FKs o tempo todo: você declara <em>navigation properties</em> (propriedades de navegação) — referências diretas de uma entidade a outra — e o EF Core deduz a FK.
      </p>
      <p>
        Há três cardinalidades clássicas: <strong>um-para-um</strong> (1:1), <strong>um-para-muitos</strong> (1:N) e <strong>muitos-para-muitos</strong> (N:N). Vamos modelar cada uma com analogias e exemplos.
      </p>

      <h2>1:N — o caso mais comum</h2>
      <p>
        "Um cliente tem muitos pedidos, mas cada pedido pertence a um único cliente." Esse é o relacionamento 1:N. A tabela do "muitos" (Pedidos) carrega a FK apontando para o "um" (Clientes).
      </p>
      <pre><code>{`public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";

    // Coleção: lado "muitos" do relacionamento
    public List<Pedido> Pedidos { get; set; } = new();
}

public class Pedido
{
    public int Id { get; set; }
    public DateTime Data { get; set; }
    public decimal Total { get; set; }

    // FK explícita (boa prática)
    public int ClienteId { get; set; }

    // Navigation property: referência ao "um"
    public Cliente Cliente { get; set; } = null!;
}`}</code></pre>
      <p>
        O <code>= null!;</code> é uma promessa ao compilador: "EF Core vai preencher isso, confie em mim". Sem isso, com <em>nullable reference types</em> ativado, o compilador reclamaria que a propriedade pode ser nula.
      </p>

      <AlertBox type="info" title="Shadow Foreign Key">
        Se você omitir <code>ClienteId</code>, EF Core cria a FK automaticamente como <em>shadow property</em> (propriedade-sombra): existe no banco mas não na classe. Funciona, mas tê-la explícita facilita queries e setters diretos.
      </AlertBox>

      <h2>1:1 — pares exclusivos</h2>
      <p>
        "Cada pedido tem exatamente um endereço de entrega, e esse endereço pertence só àquele pedido." Modelar 1:1 é mais sutil: EF Core precisa saber qual lado é o "principal" (carrega a chave primária) e qual é o "dependente" (carrega a FK que também é única).
      </p>
      <pre><code>{`public class Pedido
{
    public int Id { get; set; }
    public EnderecoEntrega? Endereco { get; set; }
}

public class EnderecoEntrega
{
    public int Id { get; set; }
    public string Rua { get; set; } = "";
    public string Cidade { get; set; } = "";

    public int PedidoId { get; set; }    // FK + única
    public Pedido Pedido { get; set; } = null!;
}

// Configuração via Fluent API
mb.Entity<Pedido>()
  .HasOne(p => p.Endereco)
  .WithOne(e => e.Pedido)
  .HasForeignKey<EnderecoEntrega>(e => e.PedidoId);`}</code></pre>

      <h2>N:N — alunos e cursos</h2>
      <p>
        "Um aluno cursa várias disciplinas; cada disciplina tem vários alunos." Tradicionalmente, isso exige uma <em>tabela de junção</em> (<code>AlunoDisciplina</code>). A partir do EF Core 5, basta declarar coleções nos dois lados — a tabela é gerada automaticamente.
      </p>
      <pre><code>{`public class Aluno
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public List<Disciplina> Disciplinas { get; set; } = new();
}

public class Disciplina
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public List<Aluno> Alunos { get; set; } = new();
}

// EF Core gera tabela "AlunoDisciplina" com (AlunosId, DisciplinasId)`}</code></pre>
      <p>
        Se você precisar de colunas extras na junção (por exemplo, <code>DataMatricula</code> ou <code>Nota</code>), declare a entidade explicitamente:
      </p>
      <pre><code>{`public class Matricula
{
    public int AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;
    public int DisciplinaId { get; set; }
    public Disciplina Disciplina { get; set; } = null!;
    public DateTime Data { get; set; }
    public decimal? Nota { get; set; }
}

mb.Entity<Aluno>()
  .HasMany(a => a.Disciplinas)
  .WithMany(d => d.Alunos)
  .UsingEntity<Matricula>();`}</code></pre>

      <h2>Eager loading com Include e ThenInclude</h2>
      <p>
        Por padrão, EF Core <strong>não carrega</strong> as navigation properties — elas chegam vazias. <code>Include</code> ("inclua") instrui a carregar junto, em uma única query (eager loading, "carregamento adiantado"):
      </p>
      <pre><code>{`// Carrega cada Pedido com seu Cliente
var pedidos = await db.Pedidos
    .Include(p => p.Cliente)
    .ToListAsync();

// Múltiplos níveis: pedidos → itens → produto
var detalhados = await db.Pedidos
    .Include(p => p.Itens)
        .ThenInclude(i => i.Produto)
    .Include(p => p.Cliente)
    .ToListAsync();

// Filtrar dentro do Include (filtered include, EF Core 5+)
var ativos = await db.Clientes
    .Include(c => c.Pedidos.Where(p => p.Status == "Pago"))
    .ToListAsync();`}</code></pre>

      <h2>Lazy loading: carregar sob demanda</h2>
      <p>
        Lazy loading ("carregamento preguiçoso") faz EF Core ir ao banco automaticamente quando você acessa a navigation property pela primeira vez. Conveniente, mas perigoso — esconde queries.
      </p>
      <pre><code>{`# Instalar pacote de proxies
dotnet add package Microsoft.EntityFrameworkCore.Proxies`}</code></pre>
      <pre><code>{`// Habilitar
opt.UseLazyLoadingProxies()
   .UseSqlServer(connectionString);

// E declarar navigations como VIRTUAL
public class Cliente
{
    public int Id { get; set; }
    public virtual List<Pedido> Pedidos { get; set; } = new();
}

// Agora isso dispara um SELECT por trás:
var cliente = await db.Clientes.FindAsync(1);
foreach (var p in cliente.Pedidos) // <-- query aqui!
    Console.WriteLine(p.Total);`}</code></pre>

      <AlertBox type="danger" title="O problema N+1">
        Se você listar 100 clientes e dentro do loop acessar <code>cliente.Pedidos</code> com lazy loading, dispara 1 query para clientes + 100 queries para pedidos = 101 queries no total. É a causa #1 de lentidão com ORMs. Use <code>Include</code> explícito antes do loop.
      </AlertBox>

      <h2>Configurando relacionamentos com Fluent API</h2>
      <p>
        Para casos não-convencionais — nome de FK diferente, comportamento de delete, FK composta — use Fluent API:
      </p>
      <pre><code>{`mb.Entity<Pedido>(e =>
{
    // Relacionamento explícito
    e.HasOne(p => p.Cliente)
     .WithMany(c => c.Pedidos)
     .HasForeignKey(p => p.ClienteId)
     .OnDelete(DeleteBehavior.Restrict);   // não apaga cliente em cascata
});

// Comportamentos de OnDelete:
// Cascade   → apaga filhos junto (perigoso em produção)
// Restrict  → impede delete se houver filhos
// SetNull   → seta FK como null (FK precisa ser nullable)
// NoAction  → deixa para o banco decidir (geralmente igual a Restrict)`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>Include</code> e cair em N+1:</strong> meça com logs ou Application Insights.</li>
        <li><strong>Cascade delete sem pensar:</strong> apagar um cliente apaga todos os pedidos dele. Use <code>Restrict</code> em domínios contábeis.</li>
        <li><strong>Lazy loading sem <code>virtual</code>:</strong> proxies não interceptam — a navigation chega null silenciosamente.</li>
        <li><strong>Múltiplos Includes sem <code>AsSplitQuery</code>:</strong> gera produto cartesiano enorme em queries com várias coleções.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>1:N usa FK no lado "muitos"; declare navigation + FK explícita.</li>
        <li>1:1 exige Fluent API para definir o lado dependente.</li>
        <li>N:N pode ser implícita (EF Core 5+) ou com entidade de junção própria.</li>
        <li><code>Include</code>/<code>ThenInclude</code> são a forma segura de carregar relacionados.</li>
        <li>Lazy loading existe, mas N+1 é o monstro do armário.</li>
        <li>Configure <code>OnDelete</code> conscientemente.</li>
      </ul>
    </PageContainer>
  );
}
